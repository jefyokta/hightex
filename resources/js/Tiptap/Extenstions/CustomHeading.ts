import Heading from '@tiptap/extension-heading'
import { Plugin } from '@tiptap/pm/state'

const CustomHeading = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    return [
      `h${node.attrs.level}`,
      {
        ...HTMLAttributes,
        contenteditable: node.attrs.level === 1 ? 'false' : 'true',
      },
      0,
    ]
  },

  addCommands() {
    return {
      setHeading:
        (attrs) =>
        ({ commands }) => {
          if (attrs.level === 1) {
            return false
          }
          return commands.toggleNode('heading', 'paragraph', attrs)
        },
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        appendTransaction: (transactions, oldState, newState) => {
          const doc = newState.doc
          const firstNode = doc.firstChild
          if (!firstNode || firstNode.type.name !== 'heading' || firstNode.attrs.level !== 1) {
            return newState.tr.insert(0, newState.schema.nodes.heading.create({ level: 1 }))
          }

          return null
        },
      }),
    ]
  },
})

export default CustomHeading
