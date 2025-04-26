import Document from "@tiptap/extension-document"


const CustomDocument = Document.extend({
    content:"page+"
})

export {
    CustomDocument as Document
}
