import { CiteManager, CiteUtils } from "bibtex.js";
import { useContext } from "react";
import { MainContext } from "@/Context/MainContext";
import Dropdown from "./Dropdown";

import { MoreVertical, QuoteIcon } from "lucide-react";

const Citation: React.FC = () => {
    const ctx = useContext(MainContext);
    const cites = CiteManager.getAll();

    return (
        <div className="p-2 space-y-4">
            {cites?.length ? (
                cites.map((c, i) => {

                    const cite = new CiteUtils(c);
                    return (
                        <div
                            key={i}
                            className="group w-full flex items-center justify-between  py-3 rounded-lg bg-white shadow-sm hover:bg-gray-100 transition-all"
                        >

                            <div className="text-sm text-gray-800  px-2 w-10/12">
                                <div className="flex space-x-1">

                                    <QuoteIcon size={10} className="text-gray-500" />
                                    <p className="text-[8pt] text-slate-500">{c.id}</p>
                                </div>
                                <p className="truncate">{c.data.title}</p>
                            </div>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        className="text-gray-600  hover:bg-gray-800 text-[9pt] me-2 hover:text-gray-400 py-1 rounded-md transition-colors duration-200"
                                        aria-label="Citation options"
                                    >
                                        <MoreVertical size={14} />
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content contentClasses="w-full z-50 " width="56">
                                    <button
                                        className="text-xs px-3 py-2 text-left w-full hover:bg-gray-200 rounded-md transition-colors"
                                        onClick={() =>
                                            ctx?.editor?.chain().insertContent(`<cite cite="${c.id}"></cite>`).run()
                                        }
                                    >
                                        cite
                                    </button>
                                    <button
                                        className="text-xs px-3 py-2 text-left w-full hover:bg-gray-200 rounded-md transition-colors"
                                        onClick={() =>
                                            ctx?.editor?.chain().insertContent(`<cite cite="${c.id}" citeA="true"></cite>`).run()
                                        }
                                    >
                                        citeA
                                    </button>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    );
                })
            ) : (
                <p className="text-gray-500 text-center">No citations available</p>
            )}
        </div>
    );
};

export default Citation;
