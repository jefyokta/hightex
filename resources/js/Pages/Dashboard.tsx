import Authenticated from "@/Layouts/AuthenticatedLayout"
import { Head, usePage } from "@inertiajs/react"
import { useEditor } from "@tiptap/react"
import CreateDocument from "./Document/CreateDocument"
import { DocumentData, PageProps } from "@/types"
import DocumentList from "./Document/DocumentList"
import { DocumentPageProps } from "@/types"
import { useEffect } from "react"



export default function Dashboard() {
    const { props } = usePage<DocumentPageProps>()


    return (
        <Authenticated
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {props.document ? (<DocumentList documentdata={props.document} />) : (<CreateDocument />)}

                </div>
            </div>
        </Authenticated>
    );
}
