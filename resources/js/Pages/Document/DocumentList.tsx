import InputLabel from "@/Components/InputLabel"
import PrimaryButton from "@/Components/PrimaryButton"
import TextInput from "@/Components/TextInput"
import { DocumentData } from "@/types"
import { Link, useForm } from "@inertiajs/react"

type DLProps = {
    documentdata: DocumentData
}

const DocumentList: React.FC<DLProps> = ({ documentdata }) => {



    return (<div className="w-full flex justify-center p-5">

        <div className="w-full p-5 bg-white rounded-md shadow">
            <InputLabel>Judul</InputLabel>
            <h1 className="border-0 w-full text-xl font-bold focus:border-0"  >{documentdata.title}</h1>
            <div className="p-2">
                <ul className="">
                    <li>
                        <Link href={`/document/${documentdata.id}/bab1`}>Bab 1</Link>

                    </li>
                    <li>                    <Link href={`/document/${documentdata.id}/bab2`}>Bab 2</Link>
                    </li>
                </ul>
            </div>
            <div className="p-3">
                <PrimaryButton>Download</PrimaryButton>
            </div>
        </div>

    </div>)
}


export default DocumentList
