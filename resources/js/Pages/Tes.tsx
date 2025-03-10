import { usePage } from "@inertiajs/react"
import { PageProps } from "@/types"
import EditorLayout from "@/Layouts/EditorLayout"
import { EditorContent, EditorProvider, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Sidebar from "@/Components/Sidebar"
import Toolbar from "@/Components/Toolbar"
import Underline from "@tiptap/extension-underline"
import Strike from "@tiptap/extension-strike"
import Table from "@tiptap/extension-table"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"
import CustomHeading from "@/Tiptap/Extenstions/CustomHeading"

interface DocumentProps extends PageProps {
    chapter:{
        number:number;
        text:string;
        content:any;
    }
}
const Tes: React.FC = () => {


    const { props } = usePage<DocumentProps>()
    const extensions = [
        StarterKit,
        CustomHeading(props.chapter.text),
        Underline,
        Table,
        TableCell,
        TableHeader,
        TableRow]

    const content = '<p>Hello World!</p>'
    const editor = useEditor({
        editable: true,
        extensions,
        content
    })

    return (
        <EditorLayout>
            <Sidebar />
            <Toolbar editor={editor} />
            <div id="container" className="flex justify-center overflow-auto h-screen   pt-36  space-x-2  min-h-screen p-5">

                <div id="page" className="page">
                    <EditorContent editor={editor} ></EditorContent>
                </div>
            </div>
        </EditorLayout >
    )
}

export default Tes
