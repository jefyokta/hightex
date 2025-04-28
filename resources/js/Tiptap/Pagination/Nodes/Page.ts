/**
 * @file /src/Nodes/Page.ts
 * @name Page
 * @description Custom node for creating a page in the editor.
 */

import { Node, NodeViewRendererProps, mergeAttributes } from "@tiptap/core";
import { DEFAULT_PAGE_BORDER_CONFIG } from "../constants/pageBorders";
import { DEFAULT_PAPER_COLOUR } from "../constants/paperColours";
import { PAGE_NODE_NAME, DEFAULT_PAGE_GAP, PAGE_ATTRIBUTES } from "../constants/page";
import { getPaperDimensionsFromPageNode } from "../utils/nodes/page/attributes/paperSize";
import { getPageNodePaperColour } from "../utils/nodes/page/attributes/paperColour";
import { isPageNode } from "../utils/nodes/page/page";
import { mm, px } from "../utils/units";
import { calculateShorthandPageBorders, getPageNodePageBorders } from "../utils/nodes/page/attributes/pageBorders";
import { constructChildOnlyClipboardPlugin } from "../utils/clipboard";
import { parseHTMLNode } from "../utils/nodes/node";
import { addNodeAttributes } from "../utils/attributes/addAttributes";

const baseElement = "div" as const;
const dataPageAttribute = "data-page" as const;

type PageNodeOptions = {
    pageGap: number;
};

export const PageNode = Node.create<PageNodeOptions>({
    name: PAGE_NODE_NAME,
    group: "block",
    content: `block+`, // We must have a body section and can optionally have a header and footer
    defining: true,
    isolating: false,

    addOptions() {
        return {
            pageGap: DEFAULT_PAGE_GAP,
        };
    },

    addAttributes() {
        return addNodeAttributes(PAGE_ATTRIBUTES);
    },

    parseHTML() {
        return [parseHTMLNode(baseElement, dataPageAttribute, true)];
    },

    renderHTML({ HTMLAttributes }) {
        return [baseElement, mergeAttributes(HTMLAttributes, { [dataPageAttribute]: true, class: "page" }), 0];
    },

    addNodeView() {
        return (props: NodeViewRendererProps) => {
            const { node } = props;
            const dom = document.createElement(baseElement);
            dom.setAttribute(dataPageAttribute, String(true));
            dom.classList.add(PAGE_NODE_NAME);

            const { width, height } = getPaperDimensionsFromPageNode(node);
            dom.style.width = mm(width);
            dom.style.height = mm(height);

            const pageBorders = getPageNodePageBorders(node) ?? DEFAULT_PAGE_BORDER_CONFIG;
            dom.style.borderWidth = calculateShorthandPageBorders(pageBorders);
            dom.style.borderStyle = "solid";
            dom.style.borderColor = "#ccc";

            const paperColour = getPageNodePaperColour(node) ?? DEFAULT_PAPER_COLOUR;
            dom.style.background = paperColour;

            dom.style.overflow = "hidden";
            dom.style.position = "relative";

            dom.style.marginTop = px(this.options.pageGap);
            dom.style.marginLeft = "auto";
            dom.style.marginRight = "auto";
            // dom.style.boxSizing = "border-box";

            const contentDOM = document.createElement(baseElement);
            dom.appendChild(contentDOM);

            return {
                dom,
                contentDOM,
            };
        };
    },

    addProseMirrorPlugins() {
        return [constructChildOnlyClipboardPlugin("pageClipboardPlugin", this.editor.schema, isPageNode)];
    },

});
