import DangerButton from "@/Components/DangerButton"
import InputLabel from "@/Components/InputLabel"
import Modal from "@/Components/Modal"
import PrimaryButton from "@/Components/PrimaryButton"
import TextInput from "@/Components/TextInput"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import { useForm } from "@inertiajs/react"
import { FormEventHandler, useState } from "react"

const CreateDocument: React.FC = () => {
    const [modal, setModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: ''
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('document.store'), { // Pastikan route benar
            onSuccess: () => {
                setModal(false);
                reset();
            }
        });
    }

    return (
        <>
            <Modal show={modal} maxWidth="2xl" closeable={true}>
                <div className="bg-white w-full p-5">
                    <form onSubmit={submit} className="flex flex-col space-y-2">
                        <div>
                            <InputLabel htmlFor="documenttitle" value="Title" />
                            <TextInput
                                id="documenttitle"
                                type="text"
                                name="title"
                                className="mt-1 block w-full"
                                required
                                isFocused={true}
                                placeholder="Judul"
                                value={data.title} // Tambahkan value
                                onChange={(e) => setData('title', e.target.value)} // Update state
                            />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                        </div>

                        <div className="flex justify-end space-x-2">
                            <PrimaryButton type="submit" disabled={processing}>Create</PrimaryButton>
                            <DangerButton type="button" onClick={() => setModal(false)}>Close</DangerButton>
                        </div>
                    </form>
                </div>
            </Modal>

            <div className="w-full h-dvh flex justify-center items-center">
                <div>
                    <h1 className="text-center text-slate-700 mb-2">Let's Begin Your First Thesis!</h1>
                    <PrimaryButton onClick={() => setModal(true)}>Create A New Document</PrimaryButton>
                </div>
            </div>
        </>
    )
}

export default CreateDocument;
