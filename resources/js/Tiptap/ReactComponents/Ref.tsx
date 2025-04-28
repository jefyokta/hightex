import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import ChapterProvider from "@/Utilities/ChapterProvider"
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"


declare type RefType = "imageFigure" | "figureTable"
export const RefComponent: React.FC<NodeViewProps> = ({ node, updateAttributes,deleteNode }) => {

    const chapter = ChapterProvider.getchapter()
    const tiptapContainer = typeof document !== 'undefined' ? document.getElementById('container') : null;
    const [ref, setRef] = useState<string>(node.attrs.link || '');
    const [type, setType] = useState<RefType>(node.attrs.ref || 'imageFigure');
    const getLabel = (id: string, type: RefType): string => {
        if (!tiptapContainer) return '<Container not found>';

        if (type === 'imageFigure') return getImageLabel(id);
        if (type === 'figureTable') return getTableLabel(id);

        return `@${type}[${id}]`;
    };

    const getImageLabel = (id: string) => {
        const images = tiptapContainer?.querySelectorAll('figure[data-type="imageFigure"]') || [];
        for (let i = 0; i < images.length; i++) {
            if (images[i].getAttribute('id') === id) return `Gambar ${chapter}.${i + 1}`;
        }
        return `@imageFigure[${id}]`;
    };
    useEffect(() => {
        queueMicrotask(() => {
          updateAttributes({ link: ref || node.attrs.ref, ref: type });
        });
      }, [ref, type]);

    const getTableLabel = (id: string) => {
        const tables = tiptapContainer?.querySelectorAll('figure[data-type="figureTable"]') || [];
        for (let i = 0; i < tables.length; i++) {
            if (tables[i].getAttribute('id') === id) return `Tabel ${chapter}.${i + 1}`;
        }
        return `@figureTable[${id}]`;
    };



    return (
        <NodeViewWrapper className="ref-component inline hover:bg-blue-200 rounded-sm cursor-pointer" data-red={node.attrs.ref} data-type="ref-component">
            <Popover>
                <PopoverTrigger >
                    <a>{getLabel(ref, type)}</a>
                    {/* <NodeViewContent></NodeViewContent> */}
                </PopoverTrigger>
                <PopoverContent className="w-64">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="link-url" className="text-sm text-neutral-700">Edit Ref</label>
                        <Input
                            id="link-url"
                            value={ref}
                            onChange={(e) => setRef(e.target.value)}
                            placeholder="ref"
                        />
                        <label htmlFor="link-type" className="text-sm text-neutral-700">Type</label>
                        <Select onValueChange={setType as (v: string) => void} defaultValue={node.attrs.ref}>
                            <SelectTrigger className="w-full">
                                <SelectValue>{type}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="imageFigure">Image</SelectItem>
                                    <SelectItem value="figureTable">Table</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button variant={'outline'} className="text-red-500 cursor-pointer" onClick={deleteNode}>Delete</Button>
                    </div>
                </PopoverContent>
            </Popover>
        </NodeViewWrapper>
    );
};
