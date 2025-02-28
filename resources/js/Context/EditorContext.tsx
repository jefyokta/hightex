import { createContext, useContext } from "react";
import { Editor } from "@tiptap/react";

interface EditorContextValue {
    editor: Editor | null;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export const useEditorContext = () => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error("useEditorContext must be used within an EditorProvider");
    }
    return context;
};

export default EditorContext;
