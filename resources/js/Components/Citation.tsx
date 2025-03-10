import { CiteManager } from "bibtex.js"
import { Editor } from "@tiptap/react";

type CitationProps = { editor: Editor };
const Citation: React.FC<CitationProps> = ({ editor }) => {
    const cites = CiteManager.getAll();
    return (<div>

        {cites.map((c, i) => {
            return <div key={i}>
                <button onClick={() => editor.chain().insertContent(`<cite cite="${c.id}"></cite>`).run()}>{c.id}</button>
            </div>
        })}
    </div>)

}
export default Citation
