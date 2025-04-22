import { useContext } from "react";
import ImageList from "./ImageList";
import TableSetting from "./TableSettings";
import { MainContext } from "@/Context/MainContext";
import { CitationSettings } from "./CitationSettings";
import { Table, Image, Quote, Sigma } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type SideBarProps = {
    el?: "images" | "table" | "citation" | "math";
    props?: Record<any, any>;
};

export default function Sidebar() {
    const ctx = useContext(MainContext);

    const child: Record<string, React.ComponentType<any>> = {
        table: TableSetting,
        images: ImageList,
        citation: CitationSettings
    };

    const Component = ctx?.sidebar.el ? child[ctx.sidebar.el] : null;

    const tabs = [
        { el: "table", icon: Table, label: "Table" },
        { el: "images", icon: Image, label: "Image" },
        { el: "citation", icon: Quote, label: "Citation" },
        { el: "math", icon: Sigma, label: "Math" },
    ];
    return (
        <div className=" fixed w-66 py-3 ">
            <div
                id="sidebar"
                className={`w-66 min-h-96 left-0 mt-48 shadow-xl ms-5 border border-slate-100 from-white  bg-linear-to-bl/hsl  to-green-100/30  rounded-xl
            transform transition-transform duration-400 ease-in-out overflow-hidden
            ${ctx?.sidebar.el ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
            >

                <div className="h-12  flex items-center justify-center px-2  ">
                    <div className="flex gap-2 w-full justify-around">
                        {tabs.map(({ el, icon: Icon }) => {
                            const isActive = ctx?.sidebar.el === el;
                            return (
                                <button
                                    key={el}
                                    onClick={() => ctx?.setSidebar({ el: el as any })}
                                    className={`relative p-2 rounded-lg transition-colors duration-200 flex items-center justify-center ${isActive ? "bg-gray-100 text-green-600" : "hover:bg-gray-50 text-gray-500"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {isActive && (
                                        <motion.div
                                            layoutId="tab-indicator"
                                            className="absolute  bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-green-500 rounded-full"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="p-2 mx-2 rounded-xl bg-white/50 border border-gray-200/50 shadow h-96 my-2">
                    {Component && <Component {...ctx?.sidebar.props} />}
                </div>
            </div>
        </div>
    );
}
