import { ReactNodeViewRenderer } from "@tiptap/react";
import { FigureTable } from "./FigureTable";
import { SplittedTableComponent } from "../ReactComponents/SplittedTable";

export const SplittedTable = FigureTable.extend({
    name:"splittedTable",
    content:"table",
    group:"block",
    addAttributes() {
        return {
            groupId:{
                parseHTML:(element) =>element.getAttribute('data-groupId'),
                renderHTML:(attr) =>({"data-group":attr.groupId})
            }

        }
    },

    addNodeView() {
        return ReactNodeViewRenderer(SplittedTableComponent)
    },
})
