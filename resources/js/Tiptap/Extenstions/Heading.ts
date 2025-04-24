
import { uniqId } from '@/Utilities/UniqId'
import Heading from '@tiptap/extension-heading'
import { Plugin } from '@tiptap/pm/state'
import { mergeAttributes } from '@tiptap/react'


 const CHeading =  Heading.extend(
    {


        addAttributes(){

            return {
                ...this.parent?.(),
                headingId:{
                    parseHTML:(element)=> ( {   headingId:  element.getAttribute('id') || `heading-${uniqId()}`}),
                    renderHTML:(attributes) =>({id:attributes.headingId || `heading-${uniqId()}`}),
                    keepOnSplit:false
                }
            }
        },

        renderHTML(props) {
            const hasLevel =this.options.levels.includes(props.node.attrs.level)
            const level = hasLevel ? props.node.attrs.level : this.options.levels[0]
            const id = props.node.attrs.headingId || `heading-${uniqId()}`
            const headingId = id
            // this.

            return [`h${level}`,mergeAttributes(props.HTMLAttributes,{id}),0]
        },
        parseHTML() {

         return this.options.levels.map(l=>{
            return {
            tag:`h${l}`,
            getAttrs(node) {
               return {headingId:node.getAttribute('id') || 'heading-'+uniqId()}
            },
        }

})
        },






})

export { CHeading as Heading}
