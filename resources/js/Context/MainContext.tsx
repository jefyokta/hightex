import { SideBarProps } from "@/Components/Sidebar";
import { createContext, Dispatch, SetStateAction } from "react";
import { Editor } from "@tiptap/react";


interface SidebarCtx {
    sidebar: SideBarProps,
    setSidebar: (sidebar: SideBarProps) => void,
    tableHelper:boolean,
    setTableHelper:Dispatch<SetStateAction<boolean>>,
    editor:Editor | null
}
export const MainContext = createContext<SidebarCtx | null>(null)


