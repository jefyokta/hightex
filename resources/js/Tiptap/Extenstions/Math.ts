import { CommandProps, Node } from '@tiptap/core';
import { mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import katex from 'katex';
import { MathBlockComponent } from '../ReactComponents/MathBlock';


export const MathBlock = Node.create({
  name: 'blockMath',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      latex: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-latex') || '',
        renderHTML: (attributes) => ({ latex: attributes.latex }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-latex]' }];
  },

  renderHTML({ node }) {
    return [
      'div',
      { 'data-latex': node.attrs.latex },
      katex.renderToString(node.attrs.latex, { throwOnError: false, displayMode: true }),
    ];
  },

  addNodeView(){
    return ReactNodeViewRenderer(MathBlockComponent)
  }
});

export const MathInline = Node.create({
  name: 'inlineMath',
  group: 'inline',
  inline: true,
  code: true,
  parseHTML() {
    return [{ tag: 'span[data-latex]' }];
  },
  renderHTML({ node }) {
    return [
      'span',
      { latex:node.attrs.latex},
      katex.renderToString(node.attrs.latex, { throwOnError: false }),
    ];
  },


});
