import { EditorState, Plugin, PluginKey } from "@tiptap/pm/state"
import { EditorView } from "@tiptap/pm/view"
import { Paginate } from "../Paginate";


const Page = new Plugin({
        key:new PluginKey("page"),
        view() {
            let working = false;
            return {

                update:(view:EditorView, prevState:EditorState) =>{
                    const {state} = view
                    const { doc , schema} = state
                    const changed = !doc.eq(prevState.doc)
                    const contents = doc.content.content
                    if (!changed || working) return
                    working = true
                    Paginate.set(contents,view).render()
                    working = false

                },
            }
        },


    })

