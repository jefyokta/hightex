
import {Paragraph} from "@tiptap/extension-paragraph"

export const SplittedParagraph = Paragraph.extend({
    name:"splittedParagraph",
    addAttributes(){
        return {
            ...this.parent?.(),
            groupId:{

                parseHTML:(element) =>(element.getAttribute('data-groupId')),
                renderHTML(attributes) {
                    return {"data-groupId":attributes.groupId}
                },

            },

            splitted:{
                default:true,
                renderHTML:(a)=>({'data-split':true}),
                parseHTML:(element) =>true,

            }
        }
    }
})
