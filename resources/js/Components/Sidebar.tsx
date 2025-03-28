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
        <div className="p-2 fixed w-56 ">
            <div
                id="sidebar"
                className={`w-56 min-h-96 left-0 mt-48 pt-2 shadow-xl ms-2 bg-white rounded-xl p-2
            transform transition-transform duration-400 ease-in-out
            ${ctx?.sidebar.el ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
            >
                <div className="border-b p-2 text-sm border-slate-200">test</div>
                {Component && <Component {...ctx?.sidebar.props} />}
            </div>
        </div>
    );
}
