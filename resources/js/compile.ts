import {style} from "@/Utilities/Style";
import { TableCell, TableHeader, Table } from "@/Tiptap/Extenstions/Table"
import TableRow from "@tiptap/extension-table-row";
import Underline from "@tiptap/extension-underline";
import { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { columnResizing } from "prosemirror-tables";
import { Caption } from "./Tiptap/Extenstions/Caption";
import { Cite } from "./Tiptap/Extenstions/Cite";
import { FigCaption } from "./Tiptap/Extenstions/Figcaption";
import { FigureImage } from "./Tiptap/Extenstions/FigureImage";
import { FigureTable } from "./Tiptap/Extenstions/FigureTable";
import { Image } from "./Tiptap/Extenstions/Image";





window.onload = () => {
    console.log("Script loaded!");

    const styleTag =document.createElement('style')
styleTag.innerHTML = style

document.head.appendChild(styleTag)
    const editor = new Editor({
        element: document.getElementById('app') as HTMLDivElement,
        content: "<p>Hello World</p>",
        extensions: [
            StarterKit,
            Underline,
            Table.configure({ resizable: true }),
            TableCell,
            TableHeader,
            TableRow,
            FigCaption,
            Cite,
            FigureTable,
            FigureImage,
            Image,
            Caption,
            columnResizing as any
        ],
    });
};

