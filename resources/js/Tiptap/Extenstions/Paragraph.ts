
import {Paragraph} from "@tiptap/extension-paragraph"

const CParagraph = Paragraph.extend({
    addAttributes(){
        return {
            ...this.parent?.(),
            groupId:{

                parseHTML:(element) =>(element.getAttribute('data-groupId')),
                renderHTML(attributes) {
                    return {"data-groupId":attributes.groupId}
                },

            }
        }
    }
})

export{
    CParagraph as Paragraph
}
