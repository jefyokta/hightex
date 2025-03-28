import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react"
import { useForm, usePage } from "@inertiajs/react"
import PrimaryButton from "./PrimaryButton"
import { Fragment, useContext, useState } from "react";
import { MainContext } from "@/Context/MainContext";
import Modal from "./Modal";

interface ImagesOptions {
    images?: string[]
}
interface ImageListProps extends ImagesOptions {
    asSingleImage?: boolean
}
const ImageList: React.FC<ImageListProps> = ({ images, asSingleImage }) => {
    const ctx = useContext(MainContext)



    const { data, setData, post } = useForm({ image: null })
    const [Images, setImages] = useState<string[] | undefined>(images);
    const [showModal, setShowModal] = useState<boolean>(false);
    const storeImage = (e: React.FormEvent) => {
        e.preventDefault()
        post("/image")

    }


    return (<div className="p-5">
        <h1 className="font-semibold text-lg mb-5">Images</h1>
        <div className="w-full space-y-2 ">
            {asSingleImage ? <></> : <MultiImage images={Images} />}
        </div>
        <button className="group shadow-lg hover:bg-slate-100 w-full h-24   flex flex-row rounded-md" onClick={() => setShowModal(!showModal)}>
            <div className="flex flex-col justify-center align-center w-full py-1">
                <svg viewBox="0 0 24 24" className="h-18 stroke-slate-500 group-hover:stroke-slate-700" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">
                        <circle cx="12" cy="12" r="6" strokeWidth="1"></circle>
                        <path d="M14 12L12 12M12 12L10 12M12 12L12 10M12 12L12 14" strokeWidth="1" strokeLinecap="round"></path> </g></svg>
                <p className="text-[9px] ">Add Image</p>
            </div>
        </button>
        <Modal show={showModal} maxWidth="xl">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex justify-between p-4">
                    <p className="font-semibold text-xl">Add Image</p>
                    <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        ✕
                    </button>
                </div>

                <form className="p-6 flex flex-col space-y-4">
                    <label htmlFor="image" className="font-medium text-gray-700">Image</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-300"
                    />
                    <PrimaryButton className="flex justify-center">Add</PrimaryButton>
                </form>
            </div>
        </Modal>

    </div>
    )

}

const SingleImage: React.FC = () => {
    const ctx = useContext(MainContext)
    return <></>

}

const MultiImage: React.FC<ImagesOptions> = ({ images }) => {
    const ctx = useContext(MainContext)
    {
        if (images) {
            return images.map((img, i) => {
                return <Popover className="relative" key={i}>
                    <PopoverButton className="rounded-md w-full cursor-pointer">
                        <img src={img} alt="Preview" className="w-full h-24 rounded-md" />
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
                                <button className="px-2 py-1 rounded-sm hover:bg-slate-100" onClick={() => ctx?.editor?.chain().insertContent({ type: 'image', attrs: { src: img } }).run()}>Add</button>

                                <button className="px-2 py-1 rounded-sm hover:bg-slate-100" onClick={() => ctx?.editor?.chain().addFigureImage(img)}>Add As Figure</button>
                                <button className="px-2 py-1 rounded-sm hover:bg-slate-100">Update</button>
                            </div>
                        </PopoverPanel>
                    </Transition>
                </Popover>
            })
        }
    }
    return <></>

}

export default ImageList
