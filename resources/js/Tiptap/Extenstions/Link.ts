import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { LinkComponent } from '../ReactComponents/Link'

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
        tag: 'div[data-type="link-component"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes,node }) {
    return ['div', mergeAttributes({"data-type":"link-component"},HTMLAttributes),]
  },

  addNodeView() {
    return ReactNodeViewRenderer(LinkComponent)
  },


})
