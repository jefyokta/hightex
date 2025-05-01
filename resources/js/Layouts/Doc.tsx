import Doc from "@/Components/DocSidebar"
import { SidebarProvider, SidebarTrigger } from "@/Components/ui/shadcn-sidebar"

export default function DocLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <Doc />
            <main>
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    )
}
