/**
 * @file /src/utils/buildPageView.ts
 * @name BuildPageView
 * @description Utility functions for building the page view.
 */

import { Node as PMNode, ResolvedPos } from "@tiptap/pm/model";
import { Transaction } from "@tiptap/pm/state";
import { EditorView } from "@tiptap/pm/view";
import { PaginationOptions } from "../PaginationExtension";
import { MIN_PARAGRAPH_HEIGHT } from "../constants/pagination";
import { NodePosArray } from "../types/node";
import { CursorMap } from "../types/cursor";
import { Nullable, Undefinable } from "../types/record";
import { MarginConfig } from "../types/page";
import { moveToNearestValidCursorPosition, moveToThisTextBlock, setSelection, setSelectionAtEndOfDocument } from "./selection";
import { inRange } from "./math";
import { getPaginationNodeAttributes } from "./nodes/page/attributes/getPageAttributes";
import { isParagraphNode } from "./nodes/paragraph";
import { isTextNode } from "./nodes/text";
import { getPaginationNodeTypes } from "./pagination";
import { isPageNumInRange } from "./nodes/page/pageRange";
import { HeaderFooter, HeaderFooterNodeAttributes } from "../types/pageRegions";
import { getPageRegionNode } from "./pageRegion/getAttributes";
import { getMaybeNodeSize } from "./nodes/node";
import { isPageNode } from "./nodes/page/page";
import { isHeaderFooterNode } from "./nodes/headerFooter/headerFooter";
import { isBodyNode } from "./nodes/body/body";
import { Editor } from "@tiptap/core";
import { mm, px } from "./units";
import { TableHandler } from "./tableMeasure";
import { calculatePageContentPixelDimensions } from "./nodes/page/attributes/paperSize";
import { TableMeasurement } from "../types/table";

/**
 * Builds a new document with paginated content.
 *
 * @param view - The editor view.
 * @param options - The pagination options.
 * @returns {void}
 */
export const buildPageView = (editor: Editor, view: EditorView, options: PaginationOptions): void => {
    const { state, dispatch } = view;
    const { doc } = state;

    try {
        const contentNodes = collectContentNodes(doc);

        const tableHandler = new TableHandler();
        const mergedContentNodes = contentNodes.reduce((acc, { node, pos }) => {
            if (node.type.name === 'figureTable' && node.attrs.groupId) {
              if (!acc.find((n) => n.node.attrs.groupId === node.attrs.groupId)) {
                const group = tableHandler.getTableGroup(node)
                if (group) {
                  const mergedTable = tableHandler.mergeTableGroup(
                    node.attrs.groupId,
                    contentNodes,
                  )
                  if (mergedTable) {
                    acc.push({ node: mergedTable, pos })
                  }
                }
              }
            } else {
              acc.push({ node, pos })
            }
            return acc
          }, [] as NodePosArray)





        // const nodeHeights = measureNodeHeights(view,contentNodes);
        const nodeHeights = measureNodeHeights(view,mergedContentNodes);


        // Record the cursor's old position
        const { tr, selection } = state;
        const oldCursorPos = selection.from;

        const { newDoc, oldToNewPosMap } = buildNewDocument(editor, options, mergedContentNodes, nodeHeights);

        // Compare the content of the documents
        if (!newDoc.content.eq(doc.content)) {
            tr.replaceWith(0, doc.content.size, newDoc.content);
            tr.setMeta("pagination", true);

            const newDocContentSize = newDoc.content.size;
            const newCursorPos = mapCursorPosition(mergedContentNodes, oldCursorPos, oldToNewPosMap, newDocContentSize);
            paginationUpdateCursorPosition(tr, newCursorPos);
        }

        dispatch(tr);
    } catch (error) {
        console.error("Error updating page view. Details:", error);
    }
};


const collectAllNodes = (doc: PMNode): NodePosArray =>{
    const contentNodes: NodePosArray = [];
    let pos = 0;
    doc.descendants((node, offset) => {
      if (!node.isText && node.type.name !== 'doc') {
        contentNodes.push({ node, pos: offset });
      }
    });
    return contentNodes;
  }


/**
 * Collect content nodes and their existing positions.
 *
 * @param doc - The document node.
 * @returns {NodePosArray} The content nodes and their positions.
 */
const collectContentNodes = (doc: PMNode): NodePosArray => {
    const contentNodes: NodePosArray = [];
    doc.forEach((pageNode, pageOffset) => {
        if (isPageNode(pageNode)) {
            pageNode.forEach((pageRegionNode, pageRegionOffset) => {
                // console.log(pageRegionNode);

                // Offsets in forEach loop start from 0, however, the child nodes of any given node
                // have a starting offset of 1 (for the first child)
                const truePageRegionOffset = pageRegionOffset + 1;

                if (isHeaderFooterNode(pageRegionNode)) {
                    // Don't collect header/footer nodes
                } else if (isBodyNode(pageRegionNode)) {
                    pageRegionNode.forEach((child, childOffset) => {
                        // First child of body node (e.g. paragraph) has an offset of 1 more
                        // than the body node itself.
                        const trueChildOffset = childOffset + 1;

                        contentNodes.push({ node: child, pos: pageOffset + truePageRegionOffset + trueChildOffset });
                    });
                } else {
                    contentNodes.push({ node: pageRegionNode, pos: pageOffset + truePageRegionOffset });
                }
            });
        } else {
            contentNodes.push({ node: pageNode, pos: pageOffset + 1 });
        }
    });

    return contentNodes;
};

/**
 * Calculates the margins of the element.
 *
 * @param element - The element to calculate margins for.
 * @returns {MarginConfig} The margins of the element.
 */
const calculateElementMargins = (element: HTMLElement): MarginConfig => {
    const style = window.getComputedStyle(element);
    return {
        top: parseFloat(style.marginTop),
        right: parseFloat(style.marginRight),
        bottom: parseFloat(style.marginBottom),
        left: parseFloat(style.marginLeft),
    };
};

/**
 * Measure the heights of the content nodes.
 *
 * @param view - The editor view.
 * @param contentNodes - The content nodes and their positions.
 * @returns {number[]} The heights of the content nodes.
 */
const measureNodeHeights = (view: EditorView, contentNodes: NodePosArray): number[] => {
    const paragraphType = view.state.schema.nodes.paragraph;

    const nodeHeights = contentNodes.map(({ pos, node }) => {
        const domNode = view.nodeDOM(pos);
        if (domNode instanceof HTMLElement) {
            let { height } = domNode.getBoundingClientRect();
            const { top: marginTop } = calculateElementMargins(domNode);

            if (height === 0) {
                if (node.type === paragraphType || node.isTextblock) {
                    // Assign a minimum height to empty paragraphs or textblocks
                    height = MIN_PARAGRAPH_HEIGHT;
                }
            }

            // We use top margin only because there is overlap of margins between paragraphs
            return height + marginTop;
        }

        return MIN_PARAGRAPH_HEIGHT; // Default to minimum height if DOM element is not found
    });

    return nodeHeights;
};

/**
 * Build the new document and keep track of new positions.
 *
 * @param editor - The editor instance.
 * @param options - The pagination options.
 * @param contentNodes - The content nodes and their positions.
 * @param nodeHeights - The heights of the content nodes.
 * @returns {newDoc: PMNode, oldToNewPosMap: CursorMap} The new document and the mapping from old positions to new positions.
 */
const buildNewDocument = (
    editor: Editor,
    options: PaginationOptions,
    contentNodes: NodePosArray,
    nodeHeights: number[]
): { newDoc: PMNode; oldToNewPosMap: CursorMap } => {
    const { schema, doc } = editor.state;
    const { pageAmendmentOptions } = options;
    const {
        pageNodeType: pageType,
        headerFooterNodeType: headerFooterType,
        bodyNodeType: bodyType,
        paragraphNodeType: paragraphType,
    } = getPaginationNodeTypes(schema);

    let pageNum = 0;
    const pages: PMNode[] = [];
    let existingPageNode: Nullable<PMNode> = doc.maybeChild(pageNum);
    let { pageNodeAttributes, pageRegionNodeAttributes, bodyPixelDimensions } = getPaginationNodeAttributes(editor, pageNum);

    const constructHeaderFooter =
        <HF extends HeaderFooter>(pageRegionType: HeaderFooter) =>
        (headerFooterAttrs: HeaderFooterNodeAttributes<HF>): PMNode | undefined => {
            if (!headerFooterType) return;

            if (existingPageNode) {
                const hfNode = getPageRegionNode(existingPageNode, pageRegionType);
                if (hfNode) {
                    return hfNode;
                }
            }

            const emptyParagraph = paragraphType.create();
            return headerFooterType.create(headerFooterAttrs, [emptyParagraph]);
        };

    const constructHeader = <HF extends HeaderFooter>(headerFooterAttrs: HeaderFooterNodeAttributes<HF>) => {
        if (!pageAmendmentOptions.enableHeader) return;
        return constructHeaderFooter("header")(headerFooterAttrs);
    };
    const constructFooter = <HF extends HeaderFooter>(headerFooterAttrs: HeaderFooterNodeAttributes<HF>) => {
        if (!pageAmendmentOptions.enableFooter) return;
        return constructHeaderFooter("footer")(headerFooterAttrs);
    };

    const constructPageRegions = (currentPageContent: PMNode[]): PMNode[] => {
        const { body: bodyAttrs, footer: footerAttrs } = pageRegionNodeAttributes;
        const pageBody = bodyType.create(bodyAttrs, currentPageContent);
        const pageFooter = constructFooter(footerAttrs);

        const pageRegions: Undefinable<PMNode>[] = [currentPageHeader, pageBody, pageFooter];
        return pageRegions.filter((region) => !!region);
    };

    const addPage = (currentPageContent: PMNode[]): PMNode => {
        const pageNodeContents = constructPageRegions(currentPageContent);
        const pageNode = pageType.create(pageNodeAttributes, pageNodeContents);
        pages.push(pageNode);
        return pageNode;
    };

     const cmToPx = (cm:number) =>{
        const dpi = 96 ;
        return cm * (dpi / 2.54);
      }


    // Header is constructed prior to the body because we need to know its node size for the cursor mapping
    let currentPageHeader: PMNode | undefined = constructHeader(pageRegionNodeAttributes.header);
    let currentPageContent: PMNode[] = [];
    let currentHeight = 0;

    const oldToNewPosMap: CursorMap = new Map<number, number>();
    const pageOffset = 1,
        bodyOffset = 1;
    let cumulativeNewDocPos = pageOffset + getMaybeNodeSize(currentPageHeader) + bodyOffset;

    // console.log("height",bodyPixelDimensions.bodyHeight);

    const tableHandler = TableHandler.getInstance();

 // Merge tables with shared groupIds before processing

 function flushNewPage() {
    ({ pageNodeAttributes, pageRegionNodeAttributes, bodyPixelDimensions } =
      getPaginationNodeAttributes(editor, pageNum));
    currentPageHeader = constructHeader(pageRegionNodeAttributes.header);
    cumulativeNewDocPos += getMaybeNodeSize(currentPageHeader);
  }

const pageLimit = cmToPx(21.5)

for (let i = 0; i < contentNodes.length; i++) {
  const { node, pos: oldPos } = contentNodes[i]
  const baseHeight = nodeHeights[i]
  const isTable    = node.type.name === 'figureTable'
  let height       = baseHeight
  let measured     : TableMeasurement | null = null

  // ─── Hanya ukur tabel saja ───────────────────────────────────────────
  if (isTable) {
    measured = tableHandler.measureTable(node, editor.view)
    height   = measured.totalHeight
  }

  const available    = pageLimit - currentHeight
  const willOverflow = currentHeight + height > pageLimit

//   // ─── 1) Split tabel jika overflow ─────────────────────────────────────
  if (isTable && willOverflow && currentPageContent.length > 0) {
    // pasti ada measured di sini
    const { tables , } =
      tableHandler.splitTableAtHeight(
        node,
        available,
        measured!,
        editor.state.schema,
        pageLimit,
      )

      console.log(tables)

    // a) Potongan pertama + flush halaman sekarang
    currentPageContent.push(tables[0])
    const pg0 = addPage(currentPageContent)
    cumulativeNewDocPos += pg0.nodeSize - getMaybeNodeSize(currentPageHeader)

    // reset untuk halaman baru
    currentPageContent = []
    currentHeight      = 0
    pageNum++;
    flushNewPage()



    // b) Potongan‐potongan tengah tiap halaman baru
    for (let j = 1; j < tables.length - 1; j++) {
      const pgMid = addPage([tables[j]])
      cumulativeNewDocPos += pgMid.nodeSize
      pageNum++;
      flushNewPage()
    }
    const offsetInPage = currentPageContent.reduce((s, n) => s + n.nodeSize, 0)
    oldToNewPosMap.set(oldPos, cumulativeNewDocPos + offsetInPage)


    continue
  }

  // ─── 2) Non‐table overflow? flush halaman biasa ─────────────────────────
  if (!isTable && willOverflow && currentPageContent.length > 0) {
    const pg = addPage(currentPageContent)
    cumulativeNewDocPos += pg.nodeSize - getMaybeNodeSize(currentPageHeader)

    currentPageContent = []
    currentHeight      = 0
    pageNum++;
    flushNewPage()

  }

  // ─── 3) Map posisi cursor dan append node biasa (atau potongan terakhir table) ─
  const offsetInPage = currentPageContent.reduce((s, n) => s + n.nodeSize, 0)
  oldToNewPosMap.set(oldPos, cumulativeNewDocPos + offsetInPage)

  currentPageContent.push(node)
  currentHeight += height
}

// ─── 4) Flush halaman terakhir ────────────────────────────────────────────
if (currentPageContent.length > 0) {
  const lastPg = addPage(currentPageContent)
  cumulativeNewDocPos += lastPg.nodeSize
}
else {
        pageNum--;
    }

    const newDoc = schema.topNodeType.create(null, pages);
    const docSize = newDoc.content.size;
    limitMappedCursorPositions(oldToNewPosMap, docSize);

    return { newDoc, oldToNewPosMap };
};

/**
 * Limit mapped cursor positions to document size to prevent out of bounds errors
 * when setting the cursor position.
 *
 * @param oldToNewPosMap - The mapping from old positions to new positions.
 * @param docSize - The size of the new document.
 * @returns {void}
 */
const limitMappedCursorPositions = (oldToNewPosMap: CursorMap, docSize: number): void => {
    oldToNewPosMap.forEach((newPos, oldPos) => {
        if (newPos > docSize) {
            oldToNewPosMap.set(oldPos, docSize);
        }
    });
};

/**
 * Map the cursor position from the old document to the new document.
 *
 * @param contentNodes - The content nodes and their positions.
 * @param oldCursorPos - The old cursor position.
 * @param oldToNewPosMap - The mapping from old positions to new positions.
 * @param newDocContentSize - The size of the new document. Serves as maximum limit for cursor position.
 * @returns {number} The new cursor position.
 */
const mapCursorPosition = (contentNodes: NodePosArray, oldCursorPos: number, oldToNewPosMap: CursorMap, newDocContentSize: number) => {
    let newCursorPos: Nullable<number> = null;
    for (let i = 0; i < contentNodes.length; i++) {
        const { node, pos: oldNodePos } = contentNodes[i];
        const nodeSize = node.nodeSize;

        if (inRange(oldCursorPos, oldNodePos, oldNodePos + nodeSize)) {
            const offsetInNode = oldCursorPos - oldNodePos;
            const newNodePos = oldToNewPosMap.get(oldNodePos);
            if (newNodePos === undefined) {
                console.error("Unable to determine new node position from cursor map!");
                newCursorPos = 0;
            } else {
                newCursorPos = Math.min(newNodePos + offsetInNode, newDocContentSize - 1);
            }

            break;
        }
    }

    return newCursorPos;
};

/**
 * Check if the given position is at the start of a text block.
 *
 * @param doc - The document node.
 * @param $pos - The resolved position in the document.
 * @returns {boolean} True if the position is at the start of a text block, false otherwise.
 */
const isNodeBeforeAvailable = ($pos: ResolvedPos): boolean => {
    return !!$pos.nodeBefore && (isTextNode($pos.nodeBefore) || isParagraphNode($pos.nodeBefore));
};

/**
 * Check if the given position is at the end of a text block.
 *
 * @param doc - The document node.
 * @param $pos - The resolved position in the document.
 * @returns {boolean} True if the position is at the end of a text block, false otherwise.
 */
const isNodeAfterAvailable = ($pos: ResolvedPos): boolean => {
    return !!$pos.nodeAfter && (isTextNode($pos.nodeAfter) || isParagraphNode($pos.nodeAfter));
};

/**
 * Sets the cursor selection after creating the new document.
 *
 * @param tr - The current transaction.
 * @returns {void}
 */
const paginationUpdateCursorPosition = (tr: Transaction, newCursorPos: Nullable<number>): void => {
    if (newCursorPos !== null) {
        const $pos = tr.doc.resolve(newCursorPos);
        let selection;

        if ($pos.parent.isTextblock || isNodeBeforeAvailable($pos) || isNodeAfterAvailable($pos)) {
            selection = moveToThisTextBlock(tr, $pos);
        } else {
            selection = moveToNearestValidCursorPosition($pos);
        }

        if (selection) {
            setSelection(tr, selection);
        } else {
            // Fallback to a safe selection at the end of the document
            setSelectionAtEndOfDocument(tr);
        }
    } else {
        setSelectionAtEndOfDocument(tr);
    }
};

