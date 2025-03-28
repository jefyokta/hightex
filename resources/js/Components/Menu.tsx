import { Editor } from "@tiptap/react"
import { ReactNode } from "react"
import Dropdown from "./Dropdown"

export type MenuList = MenuContent[]
export type MenuContent = {
    content?: string | ReactNode
    onClick?: () => any,
    active?: boolean,
    disbaled?: boolean

}
export type MenuProps = {
    editor: Editor
}

export const CellMenu = ({ editor }: MenuProps): MenuList => {
    return [
        {
            content:
                (<Dropdown >
                    <Dropdown.Trigger>col</Dropdown.Trigger>
                    <Dropdown.Content align="right" >
                        <div className="bg-white rounde-xl  flex flex-col p-3">
                            <button className="hover:bg-slate-200 rounded-md">Add</button>
                            <button className="hover:bg-slate-200 rounded-md">delete</button>
                        </div>
                    </Dropdown.Content>

                </Dropdown>)
            ,
            // onClick: () => {},
        },
        {
            content:
                (<Dropdown >
                    <Dropdown.Trigger>row</Dropdown.Trigger>
                    <Dropdown.Content align="right" >
                        <div className="bg-white rounde-xl  flex flex-col p-3">
                            <button className="hover:bg-slate-200 rounded-md">Add</button>
                            <button className="hover:bg-slate-200 rounded-md">delete</button>
                        </div>
                    </Dropdown.Content>
                </Dropdown>)
            ,
            // onClick: () => {},
        },
        {
            content: "split",
            onClick: () => editor.chain().focus().splitCell().run(),
            disbaled:editor.can().splitCell()
        },
        {
            content: "merge",
            onClick: () => editor.chain().focus().mergeCells().run()

        },
        {
            content: "delete"
        }
        // {
        //     content: "del col",
        //     onClick: () => editor.chain().focus().deleteColumn().run(),
        // },
        // {
        //     content: "add row",
        //     onClick: () => editor.chain().focus().addRowAfter().run(),
        // },
        // {
        //     content: "del row",
        //     onClick: () => editor.chain().focus().deleteRow().run(),
        // },
        // {
        //     content: "del table",
        //     onClick: () => editor.chain().focus().deleteTable().run(),
        // },
        // {
        //     content: "merge col",
        //     onClick: () => editor.chain().focus().mergeCells().run(),
        // },
        // {
        //     content: "split col",
        //     onClick: () => editor.chain().focus().splitCell().run(),
        // },
        // {
        //     content: "td",
        //     onClick: () => editor.chain().focus().toggleHeaderCell().run(),
        // },
        // {
        //     content: "th",
        //     onClick: () => editor.chain().focus().toggleHeaderColumn().run(),
        // },
        // {
        //     content:"fix",
        //     onClick: () => editor.chain().focus().fixTables().run(),
        // },
    ];
};

export const DefaultMenu = ({ editor }: MenuProps): MenuList => {
    return [
        {
            content: <b>b</b>,
            onClick: () => editor.chain().focus().toggleBold().run(),
        },
        {
            content: <em>i</em>,
            onClick: () => editor.chain().focus().toggleItalic().run(),
        },
        {
            content: <u>u</u>,
            onClick: () => editor.chain().focus().toggleUnderline().run(),
        },
        {
            content: <s>s</s>,
            onClick: () => editor.chain().focus().toggleStrike().run(),
        },
        {
            content: <p>p</p>,
            onClick: () => editor.chain().focus().setParagraph().run(),
        },
        {
            content: "h2",
            onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
            content: "h3",
            onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        },
        {
            content: <svg className="w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <path
                        d="M21 12L9 12M21 6L9 6M21 18L9 18M5 12C5 12.5523 4.55228 13 4 13C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11C4.55228 11 5 11.4477 5 12ZM5 6C5 6.55228 4.55228 7 4 7C3.44772 7 3 6.55228 3 6C3 5.44772 3.44772 5 4 5C4.55228 5 5 5.44772 5 6ZM5 18C5 18.5523 4.55228 19 4 19C3.44772 19 3 18.5523 3 18C3 17.4477 3.44772 17 4 17C4.55228 17 5 17.4477 5 18Z"
                        stroke={editor?.isActive('bulletList') ? 'white' : 'black'}
                        strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round"></path>
                </g>
            </svg>,
            onClick: () => editor.chain().focus().toggleBulletList().run(),
        },
        {
            content: <svg className="w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            </svg>,
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
        },
    ];
};
