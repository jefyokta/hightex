import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"
import { DocumentData } from "@/types"
import { Link, useForm } from "@inertiajs/react"

type DLProps = {
    documentdata: DocumentData
}

const DocumentList: React.FC<DLProps> = ({ documentdata }) => {



    return (<div className="w-full flex justify-center p-5">

        <div className="w-full p-5 bg-white">
            <InputLabel>Judul</InputLabel>
            <h1 className="border-0 w-full text-xl font-bold focus:border-0"  >{documentdata.title}</h1>
            <div className="p-2">
                <Link href={`/document/${documentdata.id}/bab1`}>Bab 1</Link>
            </div>
        </div>

    </div>)
}


export default DocumentList
