import { EditorState, Plugin, PluginKey } from "@tiptap/pm/state"
import { EditorView } from "@tiptap/pm/view"
import { buildPageBorders, getNodesPos } from "../utilities"


const Page = new Plugin({
        key:new PluginKey("page"),
        view() {
            return {
                update:(view:EditorView, prevState:EditorState) =>{
                    const {state} = view
                    const { doc , schema} = state
                    const changed = !doc.eq(prevState.doc)
                    const contents = doc.content.content
                    if (!changed) return
                    const pos = getNodesPos(contents)
                    buildPageBorders(pos,view)

                },
            }
        },


    })

