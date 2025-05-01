import { TableOfContent } from "@/Components/TableOfContent"

import { Node as PMNode } from "@tiptap/pm/model"
import { useEffect, useState } from "react"



const Doc: React.FC = () => {

    const [c,setC] = useState<any[]|false>(false)

    useEffect(() => {
     fetch(route('document.chapters', {
            document: "67c3fa2565634"
        })).then(r => r.json()).then(r => setC(r.data as any[]))
    },[])
    return (

        <div className="flex h-dvh">
            <nav className="w-56 border  h-full p-2">
                toc

            </nav>
            <div id="content" className="p-5">
                Welcome To documentation
                Wip
                {c && <TableOfContent pages={c} />}

            </div>
        </div>
    )
}





export default Doc
