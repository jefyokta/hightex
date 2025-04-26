import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { Editor, NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import { Copy, Delete } from "lucide-react";
import { useEffect, useState } from "react";


export const FigureTableComponent: React.FC<NodeViewProps> = ({ node, updateAttributes, editor, getPos, deleteNode }) => {
    const [insideNode, setInsideNode] = useState(false);

    console.log(node.attrs)
    const copy = () => {
        node.copy();
    }
    useEffect(() => {
        const handler = ({ editor }: { editor: Editor }) => {
            const { from, to } = editor.state.selection;
            const pos = getPos();
            if (pos <= from && to <= pos + node.nodeSize) {
                setInsideNode(true);
            } else {
                setInsideNode(false);
            }
        };

        editor.on("selectionUpdate", handler);

        return () => {
            editor.off("selectionUpdate", handler);
        };
    }, [editor, getPos, node.nodeSize]);
    return (
        <NodeViewWrapper
            style={{ overflow: "visible" }}
            className="relative"
            as="figure"
            data-type="figureTable"
            data-groupid={node.attrs.groupId || null}
            data-figureid={node.attrs.figureId}
        >
            <DropdownMenu>
                <DropdownMenuTrigger className={`absolute ${insideNode ? "visible opacity-100" : "invisible opacity-0"
                    } -left-10 hover:bg-slate-100 p-1 cursor-pointer px-0.5 text-slate-500 transition-200 ease-in rounded-md`}
                >


                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-grip-vertical w-4 h-4"><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Figure Table</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={copy}>
                        <Copy className="mr-2" />
                        Copy
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => alert("Copy ref")}>
                        <Copy className="mr-2" />
                        Copy ref
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={deleteNode} className="text-red-500">
                        <Delete className="mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <NodeViewContent />
        </NodeViewWrapper>
    )
}
