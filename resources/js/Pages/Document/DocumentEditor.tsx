import { useEditor, EditorContent, Extension, AnyExtension, Content } from "@tiptap/react"

import Sidebar, { SideBarProps } from "@/Components/Sidebar"
import Toolbar from "@/Components/Toolbar"
import { MainContext } from "@/Context/MainContext"
import EditorLayout from "@/Layouts/EditorLayout"
import { Cite } from "@/Tiptap/Extenstions/Cite"
import CustomHeading from "@/Tiptap/Extenstions/CustomHeading"
import { FigCaption } from "@/Tiptap/Extenstions/Figcaption"
import { DocumentProps } from "@/types"
import { Head, usePage } from "@inertiajs/react"
import { TableCell, TableHeader, Table } from "@/Tiptap/Extenstions/Table"
import TableRow from "@tiptap/extension-table-row"
import Underline from "@tiptap/extension-underline"
import StarterKit from "@tiptap/starter-kit"
import { columnResizing } from "prosemirror-tables"
import { useState } from "react"
import AutoCapitalize from "@/Tiptap/Extenstions/AutoCapitalize"
import { FigureTable } from "@/Tiptap/Extenstions/FigureTable"
import { Caption } from "@/Tiptap/Extenstions/Caption"
import { FigureImage } from "@/Tiptap/Extenstions/FigureImage"
import { Image } from "@/Tiptap/Extenstions/Image"
import {  SaveOnLoad } from "@/Utilities/Save"


const DocumentEditor: React.FC = () => {
    const { props } = usePage<DocumentProps>()
    const extensions = [
        StarterKit.configure({ heading: false }),
        CustomHeading(props.content.main.text),
        Underline,
        Table.configure({ resizable: true }),
        TableCell,
        TableHeader,
        TableRow,
        FigCaption,
        Cite,
        AutoCapitalize,
        FigureTable,
        FigureImage,
        Image,
        Caption,
        // Pagination.configure({
        //     pageWidth: 794,
        //     pageHeight: 1123,
        //     // pageMargin: { top: 113, right: 113, bottom: 151, left: 151 },
        // }),
        columnResizing as any,

    ]


    const content = props.content.contents

    const schema = {
        type: "doc",
        content: content
    }

    const [sidebar, setSidebar] = useState<SideBarProps>({});
    const [tableHelper, setTableHelper] = useState<boolean>(false)


    const handleprint = () => {


    }



    const editor = useEditor({
        editable: true,
        extensions,
        content: content ? schema : "",
        onSelectionUpdate({ editor }) {
            if (editor.isActive("table")) {
                setSidebar({ el: 'table', props: { editor } })
            } else if (editor.isActive("image") || editor.isActive('imageFigure')) {
                setSidebar({ el: 'images', props: { asSingleImage: true } })

            }
            else {
                setSidebar({})
            }

        },
        onCreate: async ({ editor }) => {
            const response = await SaveOnLoad(props)
            if (response && response.ok) {
                setTimeout(() => {
                    location.reload()
                }, 1000);
            }
        },
        onUpdate({ editor }) {
            try {
              editor.view.updateState(editor.state);
            } catch (error) {
              console.error("Update Error:", error);
            }
          }

    })




    return (
        <EditorLayout>
            <MainContext.Provider value={{ sidebar, setSidebar, tableHelper, setTableHelper, editor }}>
                {tableHelper && <Head>
                    <style>{
                        `
                        .page table th::after, table td::after {
                            content: "";
                            position: absolute;
                            cursor: ew-resize;
                            right: 0;
                            top: 0;
                            width: 2.5px;
                            height: 100%;
                            cursor: col-resize;
                            background-color: rgba(0, 100, 250, 0.2);
                        }
                        `
                    }

                    </style>
                </Head>}
                <Sidebar />
                <Toolbar editor={editor} mytest={handleprint} documentData={props.document} chapter={props.chapter} />
                <div id="container" className="flex justify-center overflow-auto h-screen   pt-36  space-x-2  min-h-screen p-5">
                    <div id="page" className="page" style={{ counterReset: `h1-counter ${props.content.main.number - 1}` }}>
                        <EditorContent editor={editor} ></EditorContent>
                    </div>
                </div>
            </MainContext.Provider>
        </EditorLayout >
    )

}

export default DocumentEditor
