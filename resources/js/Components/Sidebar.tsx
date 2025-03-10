import ImageList from "./ImageList";
import TableSetting from "./TableSettings";

type SideBarProps = {
    el?: "images" | "table",
    props: Record<any, any>
}

export default function Sidebar({ el, props }: SideBarProps) {

    const child: Record<any, any> = {
        table: TableSetting,
        image: ImageList

    }

    return (<div id="sidebar" className="w-56 h-screen fixed left-0 mt-36  pt-2">
        <div id="sidebar-content" className="shadow-xl bg-white rounded-sm p-2 min-h-screen ">
            {child[el || "image"](props)}
            {/* <ImageList images={['https://t4.ftcdn.net/jpg/00/53/45/31/360_F_53453175_hVgYVz0WmvOXPd9CNzaUcwcibiGao3CL.jpg', 'https://t4.ftcdn.net/jpg/00/53/45/31/360_F_53453175_hVgYVz0WmvOXPd9CNzaUcwcibiGao3CL.jpg']} /> */}
        </div>
    </div>)
}

