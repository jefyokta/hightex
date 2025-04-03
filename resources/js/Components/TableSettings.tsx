import { MainContext } from "@/Context/MainContext"
import { Editor } from "@tiptap/react"
import { addColumnAfter } from "prosemirror-tables"
import { useContext, useState } from "react"

const TableSetting: React.FC = () => {
    const ctx = useContext(MainContext)
    const editor = ctx?.editor

    return (
        <div className="p-5 w-full  space-y-3 ">
            <h1 className="font-bold text-xl">Table Setting</h1>
            <div className="space-y-1 w-full">
                <h1 className="font-semibold">Column</h1>
                <div className=" w-full flex   flex-wrap" >
                    <div className="flex justify-center px-0.5 py-0.5">
                        <button disabled={!editor?.can().addColumnAfter()} onClick={() => editor?.chain().focus().addColumnAfter().run()} className=" text-xs text-center px-2 py-0.5 bg-teal-700 rounded-md text-white disabled:opacity-50" >Add</button>
                    </div>
                    <div className="flex justify-center px-0.5 py-0.5">
                        <button disabled={!editor?.can().deleteColumn()} onClick={() => editor?.chain().focus().deleteColumn().run()} className="disabled:opacity-50 text-xs text-center px-2 py-0.5 bg-red-700 rounded-md text-white" >Delete</button>
                    </div>
                    <div className="flex justify-center px-0.5 py-0.5">

                        <button disabled={!editor?.can().mergeCells()}
                            onClick={() => editor?.chain().focus().mergeCells().run()}
                            className="disabled:opacity-50 text-xs text-center px-2 py-0.5 bg-blue-800 rounded-md text-white" >Merge </button>
                    </div>
                    <div className="flex justify-center px-0.5 py-0.5">
                        <button disabled={!editor?.can().splitCell()}
                            onClick={() => editor?.chain().focus().splitCell().run()}
                            className="disabled:opacity-50 text-xs text-center px-2 py-0.5 bg-slate-700 rounded-md text-white" >Split</button>
                    </div>
                </div>
                <p className="text-xs ms-2">Alignment</p>
                <div className=" w-full flex   flex-wrap" >
                    <div className="flex justify-center px-0.5 py-0.5">
                        <button
                            onClick={() => editor?.chain().focus().setCellAlignmentLeft().run()}
                            className=" text-xs text-center px-2 py-0.5 bg-teal-700 rounded-md text-white disabled:opacity-50" >Left</button>
                    </div>
                    <div className="flex justify-center px-0.5 py-0.5">
                        <button
                            onClick={(e) => {
                                editor?.chain().focus().setCellAlignmentCenter().run()
                            }} className="disabled:opacity-50 text-xs text-center px-2 py-0.5 bg-red-700 rounded-md text-white" >Center</button>
                    </div>

                </div>
            </div>
            <hr />
            <div className="space-y-1">
                <h1 className="font-semibold">Row</h1>
                <div className="flex space-x-1">
                    <div className="flex justify-center px-0.5 py-0.5">

                        <button disabled={!editor?.can().addRowAfter()}
                            onClick={() => {
                                editor?.chain().focus().addRowAfter().run()
                            }}
                            className="disabled:opacity-50 text-xs text-center px-2 py-0.5 bg-teal-800 rounded-md text-white" >Add </button>
                    </div>
                    <div className="flex justify-center px-0.5 py-0.5">

                        <button
                            onClick={() => editor?.chain().focus().deleteRow().run()}
                            disabled={!editor?.can().deleteRow()} className="disabled:opacity-50 text-xs text-center px-2 py-0.5 bg-red-800 rounded-md text-white">Delete</button>
                    </div>
                </div>
            </div>
            <hr />
            <div>
                <div className="flex justify-start items-center my-2 space-x-2">
                    <input type="checkbox" checked={ctx?.tableHelper} onChange={() => ctx?.setTableHelper(!ctx.tableHelper)} className="rounded-full w-4 h-4 text-indigo-500 focus:ring-0 border-0 shadow-md border border-[0.5px]" />
                    <span className="text-xs">Show edge helper</span>
                </div>
                <div className="flex px-0.5 py-0.5">
                    <button
                        onClick={() => {
                            editor?.chain().focus().deleteNode("figureTable").run()
                        }}
                       className="disabled:opacity-50 text-xs text-center px-2 py-0.5 bg-red-800 rounded-md text-white">Delete Table</button>
                </div>
            </div>


        </div>
    )

}


export default TableSetting
