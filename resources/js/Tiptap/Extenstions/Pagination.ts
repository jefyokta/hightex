import { Extension } from '@tiptap/core'
import { Node } from '@tiptap/pm/model'
import { Plugin } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
export const Pagination = Extension.create({
  name: 'pagination',

  addOptions() {
    return {
      pageHeight: 29.7,
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations(state) {
            const decorations: Decoration[] = []
            const { doc, tr } = state
            let currentHeight = 0
            let pageCount = 1

            doc.forEach((node, pos) => {
              if (!node.isBlock) return

              const nodeHeight = getNodeHeight(node)
              currentHeight += nodeHeight

              if (currentHeight > Pagination.options.pageHeight * 37.8) {
                const separator = document.createElement('div')
                separator.className = 'page-break'
                separator.style.borderTop = '2px dashed #ccc'
                separator.style.margin = '20px 0'
                separator.textContent = `--- Page ${pageCount} ---`

                decorations.push(Decoration.widget(pos, separator))
                currentHeight = nodeHeight
                pageCount++
              }
            })

            return DecorationSet.create(doc,decorations)
          },
        },
      }),
    ]
  },
})

function getNodeHeight(node:Node) {
  if (node.type.name === 'paragraph') return 20
  if (node.type.name === 'heading') return 40
  return 30
}
