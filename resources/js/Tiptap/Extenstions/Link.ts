import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { Link } from '../ReactComponents/Link'

export const CustomLink = Node.create({
  name: 'customLink',
  inline: true,
  group:"inline",
  atom:true,
  addAttributes() {
    return {
      href: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'a[href]',
      },
    ]
  },

  renderHTML({ HTMLAttributes,node }) {
    return ['a', mergeAttributes(HTMLAttributes),0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(Link)
  },


})
