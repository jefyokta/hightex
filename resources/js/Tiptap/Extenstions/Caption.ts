import { mergeAttributes, Node } from "@tiptap/react"

export const Caption = Node.create({
    name:"caption",
    content :"inline+",
  selectable: false,

  draggable: false,
  parseHTML() {
    return [
      {
        tag: 'caption',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['caption', mergeAttributes(HTMLAttributes), 0]
  },
  

})
