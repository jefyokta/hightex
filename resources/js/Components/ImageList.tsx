import {
    Popover,
    PopoverButton,
    PopoverPanel,
    Transition,
} from "@headlessui/react";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { MainContext } from "@/Context/MainContext";

export type ImagesOptions = {

    images: string[];
}
const ImageList: React.FC = () => {
    const [imgs, setImages] = useState<string[]>([]);
    useEffect(() => {
        fetch(route("image"))
            .then((r) => r.json())
            .then((r: { data: string[] }) => {
                console.log(r);
                setImages(r.data);
            });


    }, []);


    return (
        <div className="p-4 space-y-4 max-h-full overflow-scroll">
            <MultiImage images={imgs} />
        </div>
    );
};

const MultiImage: React.FC<ImagesOptions> = ({ images }) => {
    const ctx = useContext(MainContext);

    if (!images || images.length === 0) return null;

    return (
        <div >
            {images.map((img, i) => (
                <Popover className="relative" key={i}>
                    <PopoverButton className="rounded-md w-full  cursor-pointer">
                        <img
                            src={"/image/" + img}
                            alt={`Preview-${i}`}
                            className="border shadow object-cover rounded-md"
                        />
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
                        <PopoverPanel className="absolute z-10 left-full ml-2 bg-white px-3 py-2 shadow-md rounded-md w-max">
                            <div className="text-xs flex flex-col space-y-1">
                                <button
                                    className="px-2 py-1 rounded-sm hover:bg-slate-100 text-left"
                                    onClick={() =>
                                        ctx?.editor
                                            ?.chain()
                                            .insertContent({ type: "image", attrs: { src: "/image/" + img } })
                                            .run()
                                    }
                                >
                                    Add
                                </button>
                                <button
                                    className="px-2 py-1 rounded-sm hover:bg-slate-100 text-left"
                                    onClick={() => ctx?.editor?.chain().addFigureImage("/image/" + img)}
                                >
                                    Add Figure
                                </button>
                                <button className="px-2 py-1 rounded-sm hover:bg-slate-100 text-left">
                                    ✏️ Update
                                </button>
                            </div>
                        </PopoverPanel>
                    </Transition>
                </Popover>
            ))}
        </div>
    );
};

export default ImageList;
