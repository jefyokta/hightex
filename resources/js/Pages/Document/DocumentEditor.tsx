import { useEditor, EditorContent, Extension, AnyExtension } from "@tiptap/react"

import Sidebar from "@/Components/Sidebar"
import Toolbar from "@/Components/Toolbar"
import { SidebarContext } from "@/Context/SidebarContext"
import EditorLayout from "@/Layouts/EditorLayout"
import { Cite } from "@/Tiptap/Extenstions/Cite"
import CustomHeading from "@/Tiptap/Extenstions/CustomHeading"
import { FigCaption } from "@/Tiptap/Extenstions/Figcaption"
import { Figure } from "@/Tiptap/Extenstions/Figure"
import { DocumentProps } from "@/types"
import { usePage } from "@inertiajs/react"
import Table from "@tiptap/extension-table"
import { TableCell, TableHeader } from "@/Tiptap/Extenstions/Table"
import TableRow from "@tiptap/extension-table-row"
import Underline from "@tiptap/extension-underline"
import StarterKit from "@tiptap/starter-kit"
import { columnResizing } from "prosemirror-tables"





const DocumentEditor: React.FC = () => {
    const { props } = usePage<DocumentProps>()

    const extensions = [
        StarterKit,
        CustomHeading(props.content.main.text),
        Underline,
        Table.configure({ resizable: true }),
        TableCell,
        TableHeader,
        // Figure,
        TableRow,
        FigCaption,
        Cite,
        columnResizing as any
    ]

    const content = props.content.contents

    const schema = {
        type: "doc",
        content: content
    }

    const editor = useEditor({
        editable: true,
        extensions,
        content: content ? schema : ""
    })



    return (
        <EditorLayout>
            <SidebarContext.Provider value={null}>
                <Sidebar el="table" props={[]} />
                <Toolbar editor={editor} documentData={props.document} chapter={props.chapter} />
            </SidebarContext.Provider>
            <div id="container" className="flex justify-center overflow-auto h-screen   pt-36  space-x-2  min-h-screen p-5">
                <div id="page" className="page" style={{ counterReset: `h1-counter ${props.content.main.number - 1}` }}>
                    <EditorContent editor={editor} ></EditorContent>
                </div>
            </div>
        </EditorLayout >
    )

}

export default DocumentEditor
