import { Editor } from "@tiptap/react"
import { CellSelection } from "prosemirror-tables"

export const getSelectedCell = (editor:Editor)=>{

    const selection = editor.state.selection
    if (selection instanceof CellSelection) {
        return selection;
      } else if (selection.$anchor.parent.type.name === "tableCell") {
        return selection.$anchor.parent; 
      }

      return null;

}
