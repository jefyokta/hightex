import {
    Popover,
    PopoverButton,
    PopoverPanel,
    Transition,
} from "@headlessui/react";
import { useForm, usePage } from "@inertiajs/react";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import PrimaryButton from "./PrimaryButton";
import Modal from "./Modal";
import { MainContext } from "@/Context/MainContext";

export type ImagesOptions = {

    images: string[];
}
const ImageList: React.FC = () => {
    const ctx = useContext(MainContext);


    const { data, setData, post } = useForm({ image: null });
    const [imgs, setImages] = useState<string[]>([]);
    const [preview, setPreview] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        fetch(route("image"))
            .then((r) => r.json())
            .then((r: { data: string[] }) => {
                console.log(r);
                setImages(r.data);
            });


    }, []);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setData("image", file as any);
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setData("image", null);
            setPreview(null);
        }
    };

    const storeImage = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (data.image) {
                post(route("image.store"), {
                    onSuccess: (r) => {
                        console.log(r);
                        setShowModal(false);
                        setPreview(null);
                        setData("image", null);

                        fetch(route("image")).then(r => r.json()).then((r: { data: string[] }) => setImages(r.data));
                    },
                    onError: (e) => {
                        console.log(e);

                    }
                });
            }
        },
        [data, post]
    );

    return (
        <div className="p-4 space-y-4">
            <MultiImage images={imgs} />

            <button
                onClick={() => setShowModal(true)}
                className="w-full h-28 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition duration-200"
            >
                <svg
                    viewBox="0 0 24 24"
                    className="h-10 stroke-slate-500 group-hover:stroke-blue-500 mb-1"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="12" cy="12" r="6" strokeWidth="1.5" />
                    <path
                        d="M12 10v4M10 12h4"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>
                <p className="text-sm text-slate-600">Add Image</p>
            </button>

            <Modal show={showModal} maxWidth="xl">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="flex justify-between p-4 border-b">
                        <p className="font-semibold text-xl">Add Image</p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="text-gray-500 hover:text-gray-700 transition"
                        >
                            ✕
                        </button>
                    </div>

                    <form
                        onSubmit={storeImage}
                        className="p-6 flex flex-col space-y-4"
                        encType="multipart/form-data"
                    >
                        <label htmlFor="image" className="font-medium text-gray-700">
                            Image
                        </label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-300"
                        />

                        {preview && (
                            <img
                                src={preview}
                                alt="Preview"
                                className="rounded-md border h-32 object-contain"
                            />
                        )}

                        <PrimaryButton className="flex justify-center">Add</PrimaryButton>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

const MultiImage: React.FC<ImagesOptions> = ({ images }) => {
    const ctx = useContext(MainContext);

    if (!images || images.length === 0) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
            {images.map((img, i) => (


                <Popover className="relative" key={i}>
                    <PopoverButton className="rounded-md w-full cursor-pointer">
                        <img
                            src={"/image/" + img}
                            alt={`Preview-${i}`}
                            className="boreder shadow object-cover rounded-md"
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
                                    ➕ Add
                                </button>
                                <button
                                    className="px-2 py-1 rounded-sm hover:bg-slate-100 text-left"
                                    onClick={() => ctx?.editor?.chain().addFigureImage("/image/" + img)}
                                >
                                    🖼️ Add As Figure
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
