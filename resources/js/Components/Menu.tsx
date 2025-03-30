import { Editor } from "@tiptap/react"
import { ReactNode } from "react"
import Dropdown from "./Dropdown"

export type MenuList = MenuContent[]
export type MenuContent = {
    content?: string | ReactNode
    onClick?: () => any,
    active?: boolean,
    disabled?: boolean,
    tippyContent?: string,

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
                    <Dropdown.Content align="right" width="36">
                        <div className="bg-white rounde-xl  flex flex-col p-3">
                            <button className="hover:bg-slate-200 rounded-md w-full text-start p-1" onClick={() => editor.chain().focus().addColumnAfter().run()}
                                disabled={!(editor.can().addColumnAfter())}
                            >Add</button>
                            <button className="hover:bg-slate-200 rounded-md w-full text-start p-1"
                                disabled={!(editor.can().deleteColumn())}
                                onClick={() => editor.chain().focus().deleteColumn().run()}>delete</button>
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
                    <Dropdown.Content align="right" width="36" >
                        <div className="bg-white rounde-xl  flex flex-col p-3">
                            <button className="hover:bg-slate-200 rounded-md w-full text-start p-1" onClick={() => editor.chain().focus().addRowAfter().run()}>Add</button>
                            <button className="hover:bg-slate-200 rounded-md w-full text-start p-1" onClick={() => editor.chain().focus().deleteRow().run()}>delete</button>
                        </div>
                    </Dropdown.Content>
                </Dropdown>)
            ,
            // onClick: () => {},
        },
        {
            content: (<svg className="group-disabled:fill-slate-300" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>{`.cls-1{fill:none;}`}</style></defs><title>split-screen</title><rect x="15" y="4" width="2" height="24"></rect><path d="M10,7V25H4V7h6m0-2H4A2,2,0,0,0,2,7V25a2,2,0,0,0,2,2h6a2,2,0,0,0,2-2V7a2,2,0,0,0-2-2Z"></path><path d="M28,7V25H22V7h6m0-2H22a2,2,0,0,0-2,2V25a2,2,0,0,0,2,2h6a2,2,0,0,0,2-2V7a2,2,0,0,0-2-2Z"></path><rect id="_Transparent_Rectangle_" data-name="<Transparent Rectangle>" className="cls-1" width="32" height="32"></rect></g></svg>),
            onClick: () => editor.chain().focus().splitCell().run(),
            disabled: !editor.can().splitCell(),
            tippyContent: "split cell"
        },
        {
            content: <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect width="48" height="48" fill="white" fillOpacity="0.01"></rect> <path d="M20 14V5C20 4.44772 19.5523 4 19 4H5C4.44772 4 4 4.44772 4 5V43C4 43.5523 4.44772 44 5 44H19C19.5523 44 20 43.5523 20 43V34" className={`group-disabled:stroke-slate-300 stroke-[#212121]`} strokeWidth="2" strokeLinecap="round"></path> <path d="M28 34V43C28 43.5523 28.4477 44 29 44H43C43.5523 44 44 43.5523 44 43V5C44 4.44772 43.5523 4 43 4H29C28.4477 4 28 4.44772 28 5V14" className={`group-disabled:stroke-slate-300 stroke-[#212121]`} strokeWidth="2" strokeLinecap="round"></path>
                <path d="M28 24H44" className={`group-disabled:stroke-slate-300 stroke-[#212121]`} strokeWidth="2" strokeLinecap="round"></path> <path d="M5 24H20" className={`group-disabled:stroke-slate-300 stroke-[#212121]`} strokeWidth="2" strokeLinecap="round"></path> <path d="M32.7485 28.8183L31.1575 27.2274L27.9756 24.0454L31.1575 20.8634L32.7485 19.2724" className={`group-disabled:stroke-slate-300 stroke-[#212121]`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M15.375 28.8183L16.966 27.2274L20.148 24.0454L16.966 20.8634L15.375 19.2724" className={`group-disabled:stroke-slate-300 stroke-[#212121]`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>,
            onClick: () => editor.chain().focus().mergeCells().run(),
            disabled: !editor.can().mergeCells(),
            tippyContent: 'merge cells'


        },
        {
            content: <svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round">
                </g><g id="SVGRepo_iconCarrier"> <title>Delete Table</title> <desc>Created with Sketch.</desc> <g id="🔍-System-Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="ic_fluent_table_delete_24_regular" className={`group-disabled:fill-slate-300 fill-[#212121]`} fillRule="nonzero"> <path d="M17.5,12 C20.5376,12 23,14.4624 23,17.5 C23,20.5376 20.5376,23 17.5,23 C14.4624,23 12,20.5376 12,17.5 C12,14.4624 14.4624,12 17.5,12 Z M17.75,3 C19.5449,3 21,4.45507 21,6.25 L21,12.0218 C20.5368,11.7253 20.0335,11.4858 19.5,11.3135 L19.5,10 L15.5,10 L15.5,11.3135 C14.9665,11.4858 14.4632,11.7253 14,12.0218 L14,10 L10,10 L10,14 L12.0218,14 C11.7253,14.4632 11.4858,14.9665 11.3135,15.5 L10,15.5 L10,19.5 L11.3135,19.5 C11.4858,20.0335 11.7253,20.5368 12.0218,21 L6.25,21 C4.45507,21 3,19.5449 3,17.75 L3,6.25 C3,4.45507 4.45507,3 6.25,3 L17.75,3 Z M15.1464,15.1464 C14.9512,15.3417 14.9512,15.6583 15.1464,15.8536 L16.7929,17.5 L15.1464,19.1464 C14.9512,19.3417 14.9512,19.6583 15.1464,19.8536 C15.3417,20.0488 15.6583,20.0488 15.8536,19.8536 L17.5,18.2071 L19.1464,19.8536 C19.3417,20.0488 19.6583,20.0488 19.8536,19.8536 C20.0488,19.6583 20.0488,19.3417 19.8536,19.1464 L18.2071,17.5 L19.8536,15.8536 C20.0488,15.6583 20.0488,15.3417 19.8536,15.1464 C19.6583,14.9512 19.3417,14.9512 19.1464,15.1464 L17.5,16.7929 L15.8536,15.1464 C15.6583,14.9512 15.3417,14.9512 15.1464,15.1464 Z M8.5,15.5 L4.5,15.5 L4.5,17.75 C4.5,18.668175 5.20710875,19.4211925 6.10647256,19.4941988 L6.25,19.5 L8.5,19.5 L8.5,15.5 Z M8.5,10 L4.5,10 L4.5,14 L8.5,14 L8.5,10 Z M8.5,4.5 L6.25,4.5 C5.2835,4.5 4.5,5.2835 4.5,6.25 L4.5,8.5 L8.5,8.5 L8.5,4.5 Z M17.75,4.5 L15.5,4.5 L15.5,8.5 L19.5,8.5 L19.5,6.25 C19.5,5.331825 18.7928913,4.5788075 17.8935274,4.50580119 L17.75,4.5 Z M14,4.5 L10,4.5 L10,8.5 L14,8.5 L14,4.5 Z" id="🎨-Color" > </path> </g> </g> </g></svg>,
            onClick: () => editor.chain().focus().deleteNode('figureTable').run(),
            disabled: !(editor.can().deleteNode('figureTable'))
        }
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


export const ImageMenu = ({ editor }: MenuProps): MenuList => {


    return [{
        content: "del fig",
        onClick: () => editor.chain().focus().deleteNode('imageFigure').run(),
        disabled: !editor.can().deleteNode('imageFigure')
    }]

}