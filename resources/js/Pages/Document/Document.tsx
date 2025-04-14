import Authenticated from "@/Layouts/AuthenticatedLayout"
import { Head, usePage } from "@inertiajs/react"
import { useEditor } from "@tiptap/react"
import CreateDocument from "./CreateDocument"
import { DocumentData, DocumentPageProps, PageProps } from "@/types"
import DocumentList from "./DocumentList"



const Document: React.FC = () => {
    const { props } = usePage<DocumentPageProps>()
    return (
        <Authenticated>
            <Head title="Document" />
            {props.document ? (<DocumentList documentdata={props.document}/>) : (<CreateDocument />)}
        </Authenticated>)

}

export default Document
