import { useEditor, EditorContent, FloatingMenu } from "@tiptap/react"
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
import { SaveOnLoad } from "@/Utilities/Save"
import { CellMenu, DefaultMenu, ImageMenu } from "@/Components/Menu"
import { DeleteContent } from "@/Components/DeleteContent"
import Modal from "@/Components/Modal"
import PrimaryButton from "@/Components/PrimaryButton"
import DangerButton from "@/Components/DangerButton"
import { Pagination } from "@/Tiptap/Extenstions/Pagination"
import { CiteLocalStorage, CiteManager } from "bibtex.js"
// import {} from "prosemirror-pagination"



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
        FloatingMenu,
        columnResizing as any,
        // Pagination.configure({
        //     pageHeight: 29.7,
        // })


    ]
    CiteManager.init(new CiteLocalStorage(`@book{butti2023high,
  title={High Performance with Laravel Octane: Learn to fine-tune and optimize PHP and Laravel apps using Octane and an asynchronous approach},
  author={Butti, Roberto},
  year={2023},
  publisher={Packt Publishing Ltd}
}`));

    const content = props.content.contents

    const schema = {
        type: "doc",
        content: content
    }


    const [confirmUnsave, setConfirmUnsave] = useState<boolean>(false);
    const [sidebar, setSidebar] = useState<SideBarProps>({
        el: "table",

    });
    const [menuActiveTab, setMenuActiveTab] = useState<"format" | "table" | "image">("format");


    const [tableHelper, setTableHelper] = useState<boolean>(false)


    const handleprint = () => { }
    const editor = useEditor({
        editable: true,
        extensions,
        content: content ? schema : "",
        onSelectionUpdate({ editor }) {


        },
        onCreate: async ({ editor }) => {
            if (localStorage.getItem('document-cache')) {
                setConfirmUnsave(true)
            }

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
        },


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
                <Modal show={confirmUnsave} maxWidth="xl">

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="flex justify-between p-4">
                            <p className="font-semibold text-xl">Found Unsaved Document {props.content.name} </p>
                            <button
                                onClick={() => setConfirmUnsave(false)}
                                className="text-gray-500 cursor-pointer hover:text-gray-700 transition"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-5">
                            <p>We found unsaved document for {props.content.name} do you wanna save it?</p>
                        </div>
                        <div className="flex justify-end p-5 space-x-4">
                            <PrimaryButton>Save</PrimaryButton>
                            <DangerButton onClick={() => setConfirmUnsave(false)}>Discard</DangerButton>
                        </div>
                    </div>
                </Modal>
                <Toolbar editor={editor} mytest={handleprint} documentData={props.document} chapter={props.chapter} />
                <Sidebar />
                <div className="flex justify-center h-full  w-full space-x-2  pt-36" id="container" >
                    <div id="page" className="page  border-slate-200 shadow-lg border " style={{ counterReset: `h1-counter ${props.content.main.number - 1}` }}>
                        <EditorContent editor={editor} />
                    </div>

                    {editor && (
                        <FloatingMenu
                            editor={editor}
                            tippyOptions={{
                                duration: 100,
                                appendTo: () => document.getElementById('container') as HTMLDivElement
                            }}
                            shouldShow={({ state }) => {
                                const { from, to } = state.selection;

                                return from !== to;
                            }}
                            className="bg-white shadow-lg text-xs  p-2 max-w-max z-50 absolute rounded-lg flex flex-col"
                        >
                            <div className="flex border-b border-slate-200">
                                <button
                                    onClick={() => setMenuActiveTab("format")}
                                    className={`px-3 py-1 ${menuActiveTab === "format" ? "border-b-2 border-blue-500" : ""}`}
                                >
                                    Format
                                </button>
                                <button
                                    onClick={() => setMenuActiveTab("table")}
                                    className={`px-3 py-1 ${menuActiveTab === "table" ? " border-b-2 border-blue-500" : ""}`}
                                >
                                    Table
                                </button>
                                <button
                                    onClick={() => setMenuActiveTab("image")}
                                    className={`px-3 py-1 ${menuActiveTab === "image" ? " border-b-2 border-blue-500" : ""}`}
                                >
                                    Image
                                </button>
                            </div>
                            <div className="flex gap-2 p-2">
                                {menuActiveTab === "format" &&
                                    DefaultMenu({ editor }).map(({ content, onClick, disabled }, i) => (
                                        <button key={i} onClick={onClick} className={`px-1 w-6 rounded-md hover:bg-slate-200  ${disabled ? "bg-slate-500" : ""} cursor-pointer`}>
                                            {content}
                                        </button>
                                    ))}

                                {menuActiveTab === "table" &&
                                    CellMenu({ editor }).map(({ content, onClick, disabled }, i) => (
                                        <button key={i} onClick={onClick} disabled={disabled} className="px-1 min-w-6 max-w-max rounded-md hover:bg-slate-200 group disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-300 cursor-pointer">
                                            {content}
                                        </button>
                                    ))}
                                {menuActiveTab === "image" && ImageMenu({ editor }).map(({ content, disabled, onClick }, i) => {
                                    return (<button key={i} onClick={onClick} disabled={disabled} className="px-1 min-w-6 max-w-max rounded-md hover:bg-slate-200 group disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-300 cursor-pointer">{content}</button>)
                                })}
                                <DeleteContent editor={editor} />
                            </div>


                        </FloatingMenu>
                    )}
                </div>
            </MainContext.Provider>
        </EditorLayout >
    )

}

export default DocumentEditor
