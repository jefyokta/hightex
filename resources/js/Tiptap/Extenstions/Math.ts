import { CommandProps, Node } from '@tiptap/core';
import { mergeAttributes } from '@tiptap/core';
import katex from 'katex';


export const MathBlock = Node.create({
  name: 'blockMath',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      latex: {
        default: '',
        parseHTML: (element) => element.getAttribute('latex') || '',
        renderHTML: (attributes) => ({ latex: attributes.latex }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[latex]' }];
  },

  renderHTML({ node }) {
    return [
      'div',
      { latex: node.attrs.latex },
      katex.renderToString(node.attrs.latex, { throwOnError: false, displayMode: true }),
    ];
  },
});

export const MathInline = Node.create({
  name: 'inlineMath',
  group: 'inline',
  inline: true,
  code: true,
  parseHTML() {
    return [{ tag: 'span[latex]' }];
  },
  renderHTML({ node }) {
    return [
      'span',
      { latex:node.attrs.latex},
      katex.renderToString(node.attrs.latex, { throwOnError: false }),
    ];
  },


});
