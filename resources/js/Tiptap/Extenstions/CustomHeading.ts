import Heading from '@tiptap/extension-heading'
import { Plugin } from '@tiptap/pm/state'

const CustomHeading = (title: string) =>
  Heading.extend({
    name: "heading",

    renderHTML({ node, HTMLAttributes }) {
      return [
        `h${node.attrs.level}`,
        {
          ...HTMLAttributes,
        //   contenteditable: node.attrs.level === 1 ? 'false' : 'true',
        },
        0,
      ]
    },

    addProseMirrorPlugins() {
        return [
          new Plugin({
            appendTransaction: (transactions, oldState, newState) => {
              const { doc } = newState
              const firstNode = doc.firstChild

              if (!firstNode) {
                return newState.tr.insert(
                  0,
                  newState.schema.nodes.heading.create(
                    { level: 1 },
                    newState.schema.text(title)
                  )
                )
              }

              if (firstNode.type.name !== 'heading' || firstNode.attrs.level !== 1) {
                return newState.tr.insert(
                  0,
                  newState.schema.nodes.heading.create(
                    { level: 1 },
                    firstNode.type.name === 'text'
                      ? firstNode
                      : newState.schema.text(title)
                  )
                )
              }

              return null
            },
          }),
        ]
      }

  })

export default CustomHeading
