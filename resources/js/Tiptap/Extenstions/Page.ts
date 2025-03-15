import { Extension } from '@tiptap/core';
import { Node, mergeAttributes } from '@tiptap/core';
import { Node as PMNode } from '@tiptap/pm/model';
import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state';

export const PageNode = Node.create({
  name: 'page',
  group: 'block',
  content: 'block+',
  defining: true,
  isolating: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-page]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-page': true, class: 'page' }), 0];
  },

  addNodeView() {
    return () => {
      const dom = document.createElement('div');
      dom.setAttribute('data-page', 'true');
      dom.classList.add('page');
      dom.style.height = '297mm'; // A4 height in mm
      dom.style.width = '210mm'; // A4 width in mm
      dom.style.padding = '25.4mm';
      dom.style.border = '1px solid #ccc';
      dom.style.background = 'white';
      dom.style.overflow = 'hidden';
      dom.style.position = 'relative';

      const contentDOM = document.createElement('div');
      dom.appendChild(contentDOM);

      return {
        dom,
        contentDOM,
      };
    };
  },
});

export const PaginationExtension = Extension.create({
  name: 'pagination',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('pagination'),
        appendTransaction: (transactions, oldState, newState) => {
          const paginationMeta = 'pagination';
          const lastTransaction = transactions[transactions.length - 1];
          const isPaginationTransaction = lastTransaction.getMeta(paginationMeta);

          // Avoid infinite loops and unnecessary processing
          if (isPaginationTransaction || !lastTransaction.docChanged) {
            return null;
          }

          const { schema } = newState;
          const pageType = schema.nodes.page;

          if (!pageType) {
            return null;
          }

          // Collect content nodes, flattening existing pages
          const contentNodes: PMNode[] = [];

          newState.doc.forEach((node) => {
            if (node.type === pageType) {
              node.forEach((child) => contentNodes.push(child));
            } else {
              contentNodes.push(node);
            }
          });

          // Partition content nodes into pages
          const pages = [];
          let currentPageContent: PMNode[] = [];
          let currentHeight = 0;
          const pageHeight = (297 - 25.4 * 2) * 3.77953; // A4 height in mm minus padding, converted to px (1 mm = 3.77953 px)
          const lineHeight = 24; // Line height in px

          for (const node of contentNodes) {
            const nodeHeight = estimateNodeHeight(node, lineHeight);

            if (currentHeight + nodeHeight > pageHeight && currentPageContent.length > 0) {
              // Start a new page
              pages.push(pageType.create({}, currentPageContent));
              currentPageContent = [node];
              currentHeight = nodeHeight;
            } else {
              currentPageContent.push(node);
              currentHeight += nodeHeight;
            }
          }

          if (currentPageContent.length > 0) {
            pages.push(pageType.create({}, currentPageContent));
          }

          const newDoc = schema.topNodeType.create(null, pages);

          // Compare the content of the documents
          if (newDoc.content.eq(newState.doc.content)) {
            return null; // No changes, skip transaction
          }

          const tr = newState.tr.replaceWith(0, newState.doc.content.size, newDoc.content);
          tr.setMeta(paginationMeta, true);

          // Map the selection from oldState to the new document
          const { selection } = oldState;
          const mappedSelection = selection.map(tr.doc, tr.mapping);

          if (mappedSelection) {
            tr.setSelection(mappedSelection);
          } else {
            // Fallback to a safe selection at the end of the document
            tr.setSelection(TextSelection.create(tr.doc, tr.doc.content.size));
          }

          return tr;
        },
      }),
    ];
  },
});

function estimateNodeHeight(node: PMNode, lineHeight: number): number {
  if (node.isTextblock) {
    const lines = node.textContent.split('\n').length || 1;
    return lines * lineHeight;
  } else if (node.type.name === 'image') {
    return 200;
  } else {
    return lineHeight;
  }
}
