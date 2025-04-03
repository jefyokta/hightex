import { CiteManager, CiteUtils } from "bibtex.js"
import { Editor } from "@tiptap/react";
import { useContext } from "react";
import { MainContext } from "@/Context/MainContext";
import Dropdown from "./Dropdown";


const Citation: React.FC = () => {

    const ctx = useContext(MainContext)
    const cites = CiteManager.getAll();
    return (<div className="p-5">


        {cites && cites.map((c, i) => {
            const cite = new CiteUtils(c)
            return <Dropdown key={i}>
                <Dropdown.Trigger >
                    <div className="text-sm border border-transparent py-2 border-b-slate-300">
                        <div className="truncate  w-11/12">{cite.getTitle()}</div>
                        {/* <p>{cite.formatAuthorname()},{c.data.year}</p> */}
                    </div>
                </Dropdown.Trigger>
                <Dropdown.Content width="36" align="right">
                    <div className="px-5">
                        <button className="truncate text-sm w-full flex flex-col items-start" onClick={() => ctx?.editor?.chain().insertContent(`<cite cite="${c.id}"></cite>`).run()}>
                            add
                        </button>
                        <button className="truncate text-sm w-full flex flex-col items-start" onClick={() => ctx?.editor?.chain().insertContent(`<cite cite="${c.id}" citeA="true"></cite>`).run()}>
                            add as citeA
                        </button>
                    </div>
                </Dropdown.Content>
            </Dropdown>
        })}
    </div>)

}
export default Citation
