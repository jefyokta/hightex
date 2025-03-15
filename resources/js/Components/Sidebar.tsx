import { useContext } from "react";
import ImageList from "./ImageList";
import TableSetting from "./TableSettings";
import { MainContext } from "@/Context/MainContext";

export type SideBarProps = {
    el?: "images" | "table";
    props?: Record<any, any>;
};

export default function Sidebar() {
    const ctx = useContext(MainContext);

    const child: Record<string, React.ComponentType<any>> = {
        table: TableSetting,
        images: ImageList,
    };

    const Component = ctx?.sidebar.el ? child[ctx.sidebar.el] : null;

    return (
        <div
            id="sidebar"
            className={`w-56 h-screen fixed left-0 mt-36 pt-2 shadow-xl bg-white rounded-sm p-2 min-h-screen
            transform transition-transform duration-400 ease-in-out
            ${ctx?.sidebar.el ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
        >
            {Component && <Component {...ctx?.sidebar.props} />}
        </div>
    );
}
