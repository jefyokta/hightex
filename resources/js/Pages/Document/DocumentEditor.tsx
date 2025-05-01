import { useEditor, EditorContent, FloatingMenu, Node, JSONContent } from "@tiptap/react"
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
import { useEffect, useState } from "react"
import AutoCapitalize from "@/Tiptap/Extenstions/AutoCapitalize"
import { FigureTable } from "@/Tiptap/Extenstions/FigureTable"
import { Caption } from "@/Tiptap/Extenstions/Caption"
import { FigureImage } from "@/Tiptap/Extenstions/FigureImage"
import { Image } from "@/Tiptap/Extenstions/Image"
import { SaveOnLoad } from "@/Utilities/Save"
import Modal from "@/Components/Modal"
import PrimaryButton from "@/Components/PrimaryButton"
import DangerButton from "@/Components/DangerButton"
import { CiteLocalStorage, CiteManager } from "bibtex.js"
import PaginationExtension, { PageNode, BodyNode, HeaderFooterNode } from "@/Tiptap/Pagination"
import { Stack } from "@mui/material"
import { Heading } from "@/Tiptap/Extenstions/Heading"
import { Document } from "@/Tiptap/Extenstions/Document"
import { CustomLink } from "@/Tiptap/Extenstions/Link"
import { ensureUniqueId } from "@/Tiptap/utils"
import { Ref } from "@/Tiptap/Extenstions/Ref"
import { FloatingDock } from "@/Components/ui/floationg-dock"
import { ImageIcon, Quote, Sigma, Table2Icon } from "lucide-react"
import ChapterProvider from "@/Utilities/ChapterProvider"
import { SplittedTable } from "@/Tiptap/Extenstions/SplittedTable"
import { MathBlock } from "@/Tiptap/Extenstions/Math"
import "katex/dist/katex.css";
import { TableHandler } from "@/Tiptap/Pagination/utils/tableMeasure"
import { TableManager } from "@/Utilities/TableManager"



const DocumentEditor: React.FC = () => {
    const { props } = usePage<DocumentProps>()
    const extensions = [
        StarterKit.configure({ heading: false, document: false, }),
        Document,
        Heading,
        CustomLink,
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
        PaginationExtension.configure({
            defaultMarginConfig: {
                top: 40,
                left: 40,
                right: 30,
                bottom: 60
            },
        }),
        PageNode.configure({
        }),
        BodyNode,
        Ref,
        SplittedTable,
        MathBlock,

    ]
    ChapterProvider.setchapter(props.content.main.number)
    CiteManager.init(new CiteLocalStorage(`@book{butti2023high,
  title={High Performance with Laravel Octane: Learn to fine-tune and optimize PHP and Laravel apps using Octane and an asynchronous approach},
  author={Butti, Roberto},
  year={2023},
  publisher={Packt Publishing Ltd}
}`));

    const content = props.content.contents

    const [contents, setContent] = useState<JSONContent | string>([
        ...content])

    const schema = {
        type: "doc",
        content: contents
    }

    useEffect(() => {
        fetch(route('document.raw', {
            document: props.document.id,
            chapter: props.content.name
        })).then(r => r.json()).then(r => console.log(r))
    }, [])


    const [confirmUnsave, setConfirmUnsave] = useState<boolean>(false);
    const [sidebar, setSidebar] = useState<SideBarProps>({
        el: "table",

    });

    const [tableHelper, setTableHelper] = useState<boolean>(false)


    const handleprint = () => { }
    const editor = useEditor({
        editable: true,
        extensions,
        content: content ? schema as any : "",
        onSelectionUpdate({ editor }) {


        },
        onCreate: async ({ editor }) => {

            editor.setEditable(false);
            ensureUniqueId(editor);
            const pages =editor.state.doc.content.content
            TableManager.init( pages)
            // editor.view.
            if (localStorage.getItem('document-cache')) {
                setConfirmUnsave(true)
            }

            const response = await SaveOnLoad(props)
            if (response && response.ok) {
                setTimeout(() => {
                    location.reload()
                }, 1000);
            }
            editor.setEditable(true)
        },
        onUpdate({ editor }) {
            ensureUniqueId(editor);
            try {
                editor.view.updateState(editor.state);
                setContent(editor.getHTML())
                console.log(TableHandler.getTableGroups())
            } catch (error) {
                console.error("Update Error:", error);
            }
        },
        onPaste(e, s) {
        },
        onBeforeCreate({ editor }) {


            // editor.schema.nodeFromJSON('')

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
                        .page table tr {
                        border:1px solid  rgba(0, 100, 250, 0.2);;
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
                <div className="fixed md:hidden  w-full z-[90] bottom-2  flex justify-center">
                    <FloatingDock desktopClassName='shadow-md' items={[{ title: "Table", icon: (<Table2Icon />), href: "" }, { title: "Image", icon: (<ImageIcon />), href: "" }, { title: "Citation", icon: (<Quote />), href: "" }, { title: "Math", icon: (<Sigma />), href: "" }]} />
                </div>
                <div className="flex  justify-center h-full  pb-10  w-full space-x-2  pt-36" id="container"  >
                    <div className="focus:outline-none mt-24" style={{ counterReset: `h1-counter ${props.content.main.number - 1}`, display: "flex", flexDirection: "column" }}>
                        <Stack direction="column" flexGrow={1} paddingX={2} overflow="auto">
                            <EditorContent editor={editor} />
                        </Stack >
                    </div>
                </div>
            </MainContext.Provider>
        </EditorLayout >
    )

}

export default DocumentEditor
