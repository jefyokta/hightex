import { markPasteRule, Node, PasteRule, ReactNodeViewRenderer } from '@tiptap/react'
import { RefComponent } from '../ReactComponents/Ref'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export const Ref = Node.create({
  name: 'refComponent',
  inline:true,
  group:"inline",
  atom:true,
  addAttributes() {
    return {
        ref:{
            renderHTML: attrs => ({ 'data-ref': attrs.ref }),
            parseHTML: element => element.getAttribute('data-ref'),
        },
      link: {
        default: '',
        renderHTML: attrs => ({ 'data-link': attrs.link }),
        parseHTML: element => element.getAttribute('data-link'),
      },
    }
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['ref-component', {
        'data-ref': node.attrs.ref,
        'data-link': node.attrs.link,
        ...HTMLAttributes,
        "data-type":"ref-component",
        class: 'ref-component' }]
  },
  parseHTML() {
      return [{
        tag:'ref-component[data-type="ref-component"]',
      },]
  },

  addNodeView() {
    console.log('React NodeView loaded!')
    return (props) => {
      console.log('React node view props:', props)
      return ReactNodeViewRenderer(RefComponent)(props)
    }
  }
  ,

  addProseMirrorPlugins() {
      return [new Plugin({
        key:new PluginKey("refPaste"),
        props:{
            handlePaste(view, event, slice) {
                const text = slice.content.textBetween(0, slice.content.size, "\n");
                const pasteRegex = /@(imageFigure|figureTable)\[([^\]]+)\]/g;
                let lastIndex = 0;
                let match;
                const { tr, schema } = view.state;

                let handled = false;

                while ((match = pasteRegex.exec(text)) !== null) {
                  handled = true;

                  const beforeText = text.slice(lastIndex, match.index);
                  if (beforeText) {
                    tr.insertText(beforeText);
                  }

                  const type = match[1];
                  const id = match[2];
                  console.log(type)

                  const nodeType = schema.nodes.refComponent;
                    const node = nodeType.create({
                      ref: type,
                      link: id,
                    });
                    tr.insert(tr.selection.from, node);


                  lastIndex = pasteRegex.lastIndex;
                }

                const afterText = text.slice(lastIndex);
                if (afterText) {
                  tr.insertText(afterText);
                }

                if (handled) {
                  view.dispatch(tr);
                }

                return handled;
              }
              ,
        }
      })]
  },

//   addPasteRules() {

//     const pasteRegex = /@(imageFigure|figureTable)\[([^\]]+)\]/
//     return [
//         markPasteRule({
//             find: pasteRegex,
//             type:this.name
//         })
//     //   new PasteRule({
//     //     find: /@(imageFigure|figureTable)\[([^\]]+)\]/g,
//     //     handler: ({ state, range, match,chain }) => {

//     //       const type = match[1];
//     //       const link = match[2];
//     //       const nodeType = state.schema.nodes.ref;


//     //     },

//     //   })
//     ];
//   }

})
