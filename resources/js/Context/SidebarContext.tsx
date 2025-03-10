import { createContext } from "react";


interface SidebarCtx {
    el: React.FC

}
export const SidebarContext = createContext<SidebarCtx | null>(null)


