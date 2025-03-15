import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react"
import { usePage } from "@inertiajs/react"
import PrimaryButton from "./PrimaryButton"
import { Fragment, useContext } from "react";
import { MainContext } from "@/Context/MainContext";


type ImageListProps = {
    images?: string[],
    asSingleImage?: boolean

}
const ImageList: React.FC<ImageListProps> = ({ images, asSingleImage }) => {
    // console.log(images)
    const ctx = useContext(MainContext)

    const { props } = usePage()
    const user = props.auth.user.id
    return (<div className="p-5">
        <h1 className="font-semibold text-lg mb-5">Images</h1>
        <div className="w-full space-x-1 flex">
            {asSingleImage ? <div>test</div> : <></>}

            {images && images.map((img, i) => {
                return <Popover className="relative" key={i}>
                    <PopoverButton className="rounded-md">
                        <img src={img} alt="Preview" className="w-24 rounded-md" />
                    </PopoverButton>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <PopoverPanel anchor={'right start'} className="absolute z-10 left-full ml-2 bg-white px-3 py-2 shadow-md rounded-md">
                            <div className="text-xs flex flex-col">
                                <button className="px-2 py-1 rounded-sm hover:bg-slate-100" onClick={() => ctx?.editor?.chain().insertContent({type:'image',attrs:{src:img}}).run()}>Add</button>

                                <button className="px-2 py-1 rounded-sm hover:bg-slate-100" onClick={() => ctx?.editor?.chain().addFigureImage(img)}>Add As Figure</button>
                                <button className="px-2 py-1 rounded-sm hover:bg-slate-100">Update</button>
                            </div>
                        </PopoverPanel>
                    </Transition>
                </Popover>
            })}
        </div>
    </div>
    )

}

export default ImageList
