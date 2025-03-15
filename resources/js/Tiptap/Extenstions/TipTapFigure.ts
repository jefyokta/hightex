import { uniqId } from '@/Utilities/UniqId'
import { mergeAttributes, Node } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'


export interface FigureAttributes {
    figureId:string;
}
export const Figure = Node.create<FigureAttributes>({
  name: 'figure',

//   addOptions() {
//     return {
//       HTMLAttributes: {},
//     }
//   },
  addAttributes() {
    return {
      figureId: {
        default: null,
        parseHTML: element => element.getAttribute('figureId') || uniqId(),
        renderHTML: attributes => ({ figureId: attributes.figureId }),
        keepOnSplit: false,
      }
    }
  },

  group: 'block',

  content: 'image figcaption',

  draggable: true,

  isolating: true,


  parseHTML() {
    return [
      {
        tag: `figure[data-type="${this.name}"]`,
        getAttrs: dom => ({
          figureId: dom.getAttribute('figureId') || uniqId(),
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes,node }) {
    return ['figure', mergeAttributes(HTMLAttributes, { 'data-type': this.name ,id:node.attrs.figureId}), 0]
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            dragstart: (view, event) => {
              if (!event.target) {
                return false
              }

              const pos = view.posAtDOM(event.target as HTMLElement, 0)
              const $pos = view.state.doc.resolve(pos)

              if ($pos.parent.type === this.type) {
                event.preventDefault()
              }

              return false
            },
          },
        },
      }),
    ]
  },
})
