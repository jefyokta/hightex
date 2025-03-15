import { PageProps } from "@/types";
import { style } from "@/Utilities/Style";
import { Head, usePage } from "@inertiajs/react";
import { EditorContext, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";

const EditorLayout: React.FC<PropsWithChildren> = ({ children }) => {

    return (

        <>
            <Head title="HighTex">
                <style>{style}</style>
            </Head>


            {children}
            <Toaster />

        </>
    );
};

export default EditorLayout;
