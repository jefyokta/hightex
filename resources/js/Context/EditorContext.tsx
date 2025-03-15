import { createContext, useContext } from "react";
import { Editor } from "@tiptap/react";

interface EditorContextValue {
    editor: Editor | null;
}

const EditorContext = createContext<EditorContextValue | null>(null);


export default EditorContext;
