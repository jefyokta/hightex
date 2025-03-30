import { Editor, JSONContent, useCurrentEditor } from "@tiptap/react"
import Dropdown from "./Dropdown"
import { DocumentData, DocumentProps } from "@/types"
import { Link, usePage } from "@inertiajs/react"
import SecondaryButton from "./SecondaryButton"
import PrimaryButton from "./PrimaryButton"
import { useContext, useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { MainContext } from "@/Context/MainContext"
import { Save } from "@/Utilities/Save"

type ToolbarProps = {
    editor: Editor | null,
    documentData: DocumentData,
    chapter: string
    mytest: () => void

}
const Toolbar: React.FC<ToolbarProps> = ({ editor, documentData, chapter, mytest }) => {

    const ctx = useContext(MainContext)
    const { props } = usePage<DocumentProps>()



    const [canSave, setCanSave] = useState<boolean>(true)





    return (
        <div className="  w-full fixed
        p-5 z-50">
            <div className="p-5 pt-1 border-slate-400/20 border bg-linear-to-br/hsl from-white from-30% to-green-100/30  backdrop-blur shadow-xl flex h-42 items-center justify-between rounded-xl">
                <div className="first">
                    <div className="px-3 py-1  my-2 flex items-end  ">
                        <div id="history" className="mr-5">
                            <button
                                onClick={() => editor?.chain().undo().run()} disabled={!editor?.can().undo()}
                                className={`group w-6 h-6 p-1 rounded-full bg-white shadow-md cursor-pointer hover:bg-teal-800 disabled:bg-slate-200  disabled:hover:bg-white `}>
                                <svg viewBox="0 0 24 24" fill="none" className="w-4" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path fillRule="evenodd" clipRule="evenodd" className="group-hover:fill-white"
                                            d="M7.53033 3.46967C7.82322 3.76256 7.82322 4.23744 7.53033 4.53033L5.81066 6.25H15C18.1756 6.25 20.75 8.82436 20.75 12C20.75 15.1756 18.1756 17.75 15 17.75H8.00001C7.58579 17.75 7.25001 17.4142 7.25001 17C7.25001 16.5858 7.58579 16.25 8.00001 16.25H15C17.3472 16.25 19.25 14.3472 19.25 12C19.25 9.65279 17.3472 7.75 15 7.75H5.81066L7.53033 9.46967C7.82322 9.76256 7.82322 10.2374 7.53033 10.5303C7.23744 10.8232 6.76256 10.8232 6.46967 10.5303L3.46967 7.53033C3.17678 7.23744 3.17678 6.76256 3.46967 6.46967L6.46967 3.46967C6.76256 3.17678 7.23744 3.17678 7.53033 3.46967Z"
                                            fill={editor?.can().undo() ? "#1C274C" : "gray"}></path>
                                    </g>
                                </svg>
                            </button>
                            <button onClick={() => editor?.chain().redo().run()} disabled={!editor?.can().redo()}
                                className={`group w-6 h-6 p-1 rounded-full shadow-md cursor-pointer bg-white hover:bg-teal-800 disabled:bg-slate-200  disabled:hover:bg-white `}>
                                <svg viewBox="0 0 24 24" fill="none" className="w-4" xmlns="http://www.w3.org/2000/svg"
                                    transform="matrix(-1, 0, 0, 1, 0, 0)">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path fillRule="evenodd" clipRule="evenodd" className="group-hover:fill-white"
                                            d="M7.53033 3.46967C7.82322 3.76256 7.82322 4.23744 7.53033 4.53033L5.81066 6.25H15C18.1756 6.25 20.75 8.82436 20.75 12C20.75 15.1756 18.1756 17.75 15 17.75H8.00001C7.58579 17.75 7.25001 17.4142 7.25001 17C7.25001 16.5858 7.58579 16.25 8.00001 16.25H15C17.3472 16.25 19.25 14.3472 19.25 12C19.25 9.65279 17.3472 7.75 15 7.75H5.81066L7.53033 9.46967C7.82322 9.76256 7.82322 10.2374 7.53033 10.5303C7.23744 10.8232 6.76256 10.8232 6.46967 10.5303L3.46967 7.53033C3.17678 7.23744 3.17678 6.76256 3.46967 6.46967L6.46967 3.46967C6.76256 3.17678 7.23744 3.17678 7.53033 3.46967Z"
                                            fill={editor?.can().redo() ? "#1C274C" : "gray"}></path>
                                    </g>
                                </svg>
                            </button>
                        </div>
                        <div className="flex items-center h-full">
                            <p className="font-bold text-xl text-teal-800 mr-4">HighTex</p>
                            <p className="text-slate-500 text-sm truncate max-w-36">{documentData.title}</p>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <p className="flex items-center">
                                        <span className="text-slate-500 text-sm">/ {chapter} </span>
                                        <svg
                                            className="-me-0.5 w-4 text-slate-500"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </p>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right">
                                    <div className="p-2 flex flex-col space-y-1">
                                        <Link className={`${chapter == 'Bab 1' ? 'bg-green-700 text-white hover:bg-green-800' : 'hover:bg-slate-100'}  p-1 px-1.5 text-sm rounded-md`} href={`/document/${documentData.id}/bab1`} >Bab 1</Link>
                                        <Link className={`${chapter == 'Bab 2' ? 'bg-green-700 text-white hover:bg-green-800' : 'hover:bg-slate-100'}  p-1 px-1.5 text-sm rounded-md`} href={`/document/${documentData.id}/bab2`}>Bab 2</Link>
                                        <Link className={`${chapter == 'Bab 3' ? 'bg-green-700 text-white hover:bg-green-800' : 'hover:bg-slate-100'}  p-1 px-1.5 text-sm rounded-md`} href={`/document/${documentData.id}/bab3`}>Bab 3</Link>
                                        <Link className={`${chapter == 'Bab 4' ? 'bg-green-700 text-white hover:bg-green-800' : 'hover:bg-slate-100'}  p-1 px-1.5 text-sm rounded-md`} href={`/document/${documentData.id}/bab4`}>Bab 4</Link>
                                        <Link className={`${chapter == 'Bab 5' ? 'bg-green-700 text-white hover:bg-green-800' : 'hover:bg-slate-100'}  p-1 px-1.5 text-sm rounded-md`} href={`/document/${documentData.id}/bab5`}>Bab 5</Link>
                                        <Link className={`${chapter == 'Bab 6' ? 'bg-green-700 text-white hover:bg-green-800' : 'hover:bg-slate-100'}  p-1 px-1.5 text-sm rounded-md`} href={`/document/${documentData.id}/bab6`}>Bab 6</Link>
                                    </div>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>

                    <div id="tools" className="text-green-700 flex space-x-2">
                        <div className="p-2 bg-white/70 px-3 rounded-xl shadow-md">
                            <div className="font-bold text-sm">Marks</div>
                            <div className="flex py-2  max-w-max max-h-max text-slate-800 px-2   space-x-1 ">
                                <button
                                    onClick={() => editor?.chain().focus().toggleBold().run()}
                                    className={`${editor?.isActive('bold') ? 'bg-indigo-700 text-white hover:bg-indigo-600' : 'hover:bg-slate-200'} cursor-pointer  w-6 h-6 flex justify-center items-center rounded-md text-sm p-1 font-bold`}>
                                    b
                                </button>
                                <button
                                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                                    className={`${editor?.isActive('italic') ? 'bg-indigo-700 text-white hover:bg-indigo-600' : 'hover:bg-slate-200'} cursor-pointer  w-6 h-6 flex justify-center items-center rounded-md text-sm p-1 italic`}>
                                    i
                                </button>
                                <button
                                    onClick={() => editor?.chain().focus().toggleUnderline().run()}
                                    className={`${editor?.isActive('underline') ? 'bg-indigo-700 text-white hover:bg-indigo-600' : 'hover:bg-slate-200'} cursor-pointer  w-6 h-6 flex justify-center items-center rounded-md text-sm p-1 `}>
                                    <u>u</u>
                                </button>
                                <button
                                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                                    className={`${editor?.isActive('strike') ? 'bg-indigo-700 text-white hover:bg-indigo-600' : 'hover:bg-slate-200'} cursor-pointer  w-6 h-6 flex justify-center items-center rounded-md text-sm p-1 `}>
                                    <s>s</s>
                                </button>
                            </div>
                        </div>
                        <div className="p-2 bg-white/70 px-3 rounded-xl shadow-md">
                            <div className="font-bold text-sm">Headings</div>
                            <div className="flex space-x-1 text-slate-800 px-2 pt-2">
                                <button
                                    onClick={() => editor?.chain().toggleHeading({ level: 2 }).run()}


                                    className="cursor-pointer hover:bg-slate-100 p-1 rounded-md  font-semibold ">1.1
                                </button>
                                <button
                                    onClick={() => editor?.chain().toggleHeading({ level: 3 }).run()}
                                    className="cursor-pointer hover:bg-slate-100 p-1 rounded-md font-semibold ">1.1.1
                                </button>
                            </div>
                        </div>
                        <div className="p-2 bg-white/70 px-3 rounded-xl shadow-md">
                            <div className="font-bold text-sm">List</div>
                            <div className="flex  space-x-1 text-slate-800 px-2 pt-2">
                                <button
                                    onClick={() => editor?.chain().toggleOrderedList().run()}

                                    className={`${editor?.isActive('orderedList') ? 'bg-indigo-700 text-white hover:bg-indigo-600' : 'hover:bg-slate-200'} cursor-pointer hover:bg-slate-100 p-1 rounded-md `}>
                                    <svg className="w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                        <g id="SVGRepo_iconCarrier">
                                            <g id="Edit / List_Ordered">
                                                <path id="Vector"
                                                    d="M10 17H20M4 15.6853V15.5C4 14.6716 4.67157 14 5.5 14H5.54054C6.34658 14 7.00021 14.6534 7.00021 15.4595C7.00021 15.8103 6.8862 16.1519 6.67568 16.4326L4 20.0002L7 20M10 12H20M10 7H20M4 5L6 4V10"
                                                    stroke={editor?.isActive('orderedList') ? 'white' : 'black'}
                                                    strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round"></path>
                                            </g>
                                        </g>
                                    </svg>
                                    {/* <span className="text-sm">
                                    </span> */}
                                </button>
                                <button

                                    onClick={() => editor?.chain().toggleBulletList().run()}

                                    className={`${editor?.isActive('bulletList') ? 'bg-indigo-700 text-white hover:bg-indigo-600' : 'hover:bg-slate-200'} cursor-pointer hover:bg-slate-100 p-1 rounded-md `}>
                                    <svg className="w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                        <g id="SVGRepo_iconCarrier">
                                            <path
                                                d="M21 12L9 12M21 6L9 6M21 18L9 18M5 12C5 12.5523 4.55228 13 4 13C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11C4.55228 11 5 11.4477 5 12ZM5 6C5 6.55228 4.55228 7 4 7C3.44772 7 3 6.55228 3 6C3 5.44772 3.44772 5 4 5C4.55228 5 5 5.44772 5 6ZM5 18C5 18.5523 4.55228 19 4 19C3.44772 19 3 18.5523 3 18C3 17.4477 3.44772 17 4 17C4.55228 17 5 17.4477 5 18Z"
                                                stroke={editor?.isActive('bulletList') ? 'white' : 'black'}
                                                strokeWidth="2" strokeLinecap="round"
                                                strokeLinejoin="round"></path>
                                        </g>
                                    </svg>
                                    {/* <span>
                                    </span> */}
                                </button>
                            </div>
                        </div>
                        <div className="p-2 bg-white/70 px-3 max-w-max rounded-xl shadow-md">
                            <div className="font-bold text-sm">Components</div>
                            <div className="flex space-x-1 text-slate-800 px-2 pt-2">
                                <button className="cursor-pointer  hover:bg-slate-100 p-1 rounded-md "
                                    onClick={() => ctx?.setSidebar({ el: 'images', props: { images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdnLs_X7GU83NaWkq3XKEOlHU8oh0_jPMcyw&s'] } })}
                                >
                                    <svg viewBox="0 0 24 24" className="w-5" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                        <g id="SVGRepo_iconCarrier">
                                            <path
                                                d="M14.2639 15.9375L12.5958 14.2834C11.7909 13.4851 11.3884 13.086 10.9266 12.9401C10.5204 12.8118 10.0838 12.8165 9.68048 12.9536C9.22188 13.1095 8.82814 13.5172 8.04068 14.3326L4.04409 18.2801M14.2639 15.9375L14.6053 15.599C15.4112 14.7998 15.8141 14.4002 16.2765 14.2543C16.6831 14.126 17.12 14.1311 17.5236 14.2687C17.9824 14.4251 18.3761 14.8339 19.1634 15.6514L20 16.4934M14.2639 15.9375L18.275 19.9565M18.275 19.9565C17.9176 20 17.4543 20 16.8 20H7.2C6.07989 20 5.51984 20 5.09202 19.782C4.71569 19.5903 4.40973 19.2843 4.21799 18.908C4.12796 18.7313 4.07512 18.5321 4.04409 18.2801M18.275 19.9565C18.5293 19.9256 18.7301 19.8727 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V16.4934M4.04409 18.2801C4 17.9221 4 17.4575 4 16.8V7.2C4 6.0799 4 5.51984 4.21799 5.09202C4.40973 4.71569 4.71569 4.40973 5.09202 4.21799C5.51984 4 6.07989 4 7.2 4H16.8C17.9201 4 18.4802 4 18.908 4.21799C19.2843 4.40973 19.5903 4.71569 19.782 5.09202C20 5.51984 20 6.0799 20 7.2V16.4934M17 8.99989C17 10.1045 16.1046 10.9999 15 10.9999C13.8954 10.9999 13 10.1045 13 8.99989C13 7.89532 13.8954 6.99989 15 6.99989C16.1046 6.99989 17 7.89532 17 8.99989Z"
                                                stroke="#000000" strokeWidth="1" strokeLinecap="round"
                                                strokeLinejoin="round"></path>
                                        </g>
                                    </svg>
                                    {/* <span>
                                Image
                            </span> */}
                                </button>
                                <button
                                    disabled={editor?.isActive('figureTable')}
                                    onClick={() => editor?.chain().focus().addFigureTable()} className="cursor-pointer   hover:bg-slate-100 p-1 rounded-md ">
                                    <svg viewBox="0 0 24 24" className="w-5" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                        <g id="SVGRepo_iconCarrier">
                                            <path
                                                d="M3 9L21 9M12 9V20M6.2 20H17.8C18.9201 20 19.4802 20 19.908 19.782C20.2843 19.5903 20.5903 19.2843 20.782 18.908C21 18.4802 21 17.9201 21 16.8V7.2C21 6.0799 21 5.51984 20.782 5.09202C20.5903 4.71569 20.2843 4.40973 19.908 4.21799C19.4802 4 18.9201 4 17.8 4H6.2C5.0799 4 4.51984 4 4.09202 4.21799C3.71569 4.40973 3.40973 4.71569 3.21799 5.09202C3 5.51984 3 6.07989 3 7.2V16.8C3 17.9201 3 18.4802 3.21799 18.908C3.40973 19.2843 3.71569 19.5903 4.09202 19.782C4.51984 20 5.07989 20 6.2 20Z"
                                                stroke="#000000" strokeWidth="1.3" strokeLinecap="round"
                                                strokeLinejoin="round"></path>
                                        </g>
                                    </svg>
                                    {/* <span>Table</span> */}
                                </button>
                            </div>
                        </div>
                        <div className="p-2 bg-white/70 px-3 rounded-xl shadow-md">
                            <div className="font-bold text-sm">Utilities</div>
                            <div className="flex space-x-1 text-slate-800 px-2 pt-2">
                                <button className="cursor-pointer hover:bg-slate-100 px-1  rounded-md " onClick={() => mytest()}>Citation</button>
                                <button className="cursor-pointer hover:bg-slate-100 px-1 rounded-md ">Math</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="second px-2">
                    <div className="flex flex-col items-end">
                        <div className="flex flex-col items-end px-2 ">
                            <p className="font-semibold text-teal-800">Jepi Oktamipa</p>
                            <p className="text-xs text-slate-500 mb-1">12250314612</p>
                        </div>
                        <div className="m-2 flex space-x-2">
                            <div className="flex space-x-3">
                                <button className="p-1 font-semibold px-2 cursor-pointer hover:text-slate-100 bg-green-700 text-xs rounded-lg text-white shadow-md my-2 ring ring-green-400/20 ring-4" onClick={async () => {
                                    setCanSave(false)
                                    await Save(props, editor)
                                    setCanSave(true)
                                }} disabled={!canSave}  >
                                    Save
                                </button>
                                <button className="p-1 font-semibold px-2 cursor-pointer hover:text-slate-100 bg-slate-700 text-xs rounded-lg text-white shadow-md my-2 ring ring-slate-400/20 ring-4" >

                                    <Link href="/dashboard">
                                    Back
                                    </Link>
                                </button>
                            </div>


                        </div>
                    </div>
                </div>

            </div>
        </div>
    )

}

export default Toolbar
