import { DocumentProps } from "@/types";

import toast from "react-hot-toast";
import { Editor } from "@tiptap/react";

export const Save = async (props:DocumentProps,editor?:Editor|null):Promise<boolean>=> {
    const contents = props.content.contents
    if (!editor) throw new Error(`Editor has not been initialized`);;
    editor.commands.blur();
        const cachedData = localStorage.getItem('document-cache')
        const csrf = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
        const docjson = editor.getJSON()
        const editorData = JSON.stringify({ data: docjson });
        const  content = docjson.content?.filter(c => {
                return !(c.type == 'heading' && c.attrs?.level == 1)
            })

        if (JSON.stringify(content) == JSON.stringify(contents)) {
            toast.success("There is nothing to save!", {
                icon: "⚠️",
            })
            return false;
        }
        const data = cachedData && cachedData == editorData ? cachedData : editorData
        try {
            const result = await fetch(`/document/${props.content.name}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrf
                },
                body: data
            });
            if (!result.ok) {
                localStorage.setItem("document-cache", data);
                toast.error("Request Error, document has been saved in your local");
                return false
            }
            localStorage.removeItem('document-cache')
            toast.success("Saved!");
            return true
        } catch (error) {
            console.error("Save error:", error);
            localStorage.setItem("document-cache", data);
            toast.error("Failed to save document. Check your internet connection.");
            return false
        }
};


export const SaveOnLoad = async (props:DocumentProps):Promise<Response | false>=>{
    const cachedData = localStorage.getItem('document-cache')
    if (cachedData) {
        const csrf = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

        async function example(){
        //  return  setTimeout(async () => {
                return await fetch(`/document/${props.content.name}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": csrf
                    },
                    body: cachedData
                })
            // }, 1000);
        }
        const response =  toast.promise(example,{
            loading:"Saving Your stored document..",
            success:()=>{
                localStorage.removeItem('document-cache')
                console.log("ah ah ah")
                return 'Saved!'
            },
            error:()=>{
                return 'Failed to save'
            }
        })

        return response

    }

    return false


}
