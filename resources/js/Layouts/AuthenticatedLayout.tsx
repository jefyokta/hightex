import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { LogOutModal } from '@/Components/LogOutModal';

import { DashboardSidebar, DesktopSidebar, SidebarBody, SidebarLink, useSidebar } from '@/Components/ui/sidebar';
import { cn } from '@/lib/utils';
import { PageProps, User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@radix-ui/react-alert-dialog';
import { IconArrowLeft, IconBrandTabler, IconImageInPicture, IconSettings, IconUserBolt } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { ImageIcon, Sidebar, TestTube, User2, User2Icon, UserCircle } from 'lucide-react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);


    return (
        <div
            className={cn(
                "mx-auto flex md:p-2 w-full  flex-1 flex-row  overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
                "h-[100vh]",
            )}
        >
            <SidebarDemo user={user} />
            <Dashboard >

                {children}
            </Dashboard>
        </div >
    )

}


export const SidebarDemo: React.FC<{ user: User }> = ({ user }) => {
    const links = [
        {
            label: "Dashboard",
            href: route('dashboard'),
            icon: (
                <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Image",
            href: route('image.index'),
            icon: (
                <ImageIcon className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Profile",
            href: route('profile.update'),
            icon: (
                <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },


    ];
    const [open, setOpen] = useState(false);

    return (
        <div
            className={cn(
                "mx-auto flex top-5 left-5 justify-center rounded-full w-12 md:w-auto h-12  max-w-7xl  flex-col overflow-hidden  border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800 fixed",
                "md:h-full md:rounded-md  md:relative md:top-0 md:-left-0",
            )}
        >
            <DashboardSidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (

                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                    <div>
                        {/* <SidebarLink
                            link={{
                                label: user.name,
                                href: route('profile.update'),
                                icon: (

                                    <UserCircle></UserCircle>
                                ),
                            }}
                        /> */}
                        <UserSidebar />

                    </div>

                </SidebarBody>
            </DashboardSidebar>

        </div>
    );
}


const UserSidebar: React.FC = () => {
    const { animate, open } = useSidebar()
    const [modal, setModal] = useState(false);
    const { auth } = usePage().props
    return (<>
        <button className="flex items-center  cursor-pointer max-w-max p-0  justify-start gap-2  group/sidebar py-2"
            onClick={() => setModal(!modal)}
        >
            <UserCircle></UserCircle>
            <motion.span
                animate={{
                    display: animate ? (open ? "inline-block" : "none") : "inline-block",
                    opacity: animate ? (open ? 1 : 0) : 1,
                }}
                className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"

            >{auth.user.name}</motion.span>
        </button>
        <LogOutModal show={modal} setShowModal={setModal}/>


    </>)

}
export const Logo = () => {
    return (
        <a
            href="#"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
        >
            <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium whitespace-pre text-black dark:text-white"
            >
                HighTex
            </motion.span>
        </a>
    );
};
export const LogoIcon = () => {
    return (
        <a
            href="/"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
        >
            <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
        </a>
    );
};

const Dashboard: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="flex flex-1">
            <div className="flex h-full overflow-y-scroll w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
                {children}
            </div>
        </div>
    );
};
