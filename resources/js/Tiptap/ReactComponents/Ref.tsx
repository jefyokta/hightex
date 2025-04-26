import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover"
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import { useState } from "react"


declare type RefType = "imageFigure"|"figureTable"
export const Ref = ({ node, updateAttributes }: NodeViewProps) => {
    const tiptapContainer = document.getElementById('container') as HTMLDivElement
    const refs = tiptapContainer.querySelectorAll('figure[figureId]')
    const [ref, setRef] = useState<string>(node.attrs.figureId)
    const [type, setType] = useState<RefType>(node.type.name as RefType)
    const [content, setContent] = useState();


    const getLabel = (id: string, type: RefType): string => {
        if (type == 'imageFigure') {
            return getImageLabel(id)
        }
        else if (type == 'figureTable') {
            return getTableLabel(id)
        }
        return ''



    }
    const getImageLabel = (id: string) => {
        const imageFigure = tiptapContainer.querySelectorAll('figure[data-type="imageFigure"]');

        for (let i = 0; i < imageFigure.length; i++) {
            const element = imageFigure[i];
            if (element.getAttribute('id') == id) {

                return `Gambar ${i + 1}`;
            }

        }
        return '<Unknown image!>'

    }

    const getTableLabel = (id: string) => {
        const figureTable = tiptapContainer.querySelectorAll('figure[data-type="figureTable"]');


        for (let i = 0; i < figureTable.length; i++) {
            const element = figureTable[i];
            if (element.getAttribute('id') == id) {
                return `Tabel .${i + 1}`
            }

        }
        return '<Unknown table!>'
    }



    const save = () => {
        updateAttributes({ ref: ref, type: type })
    }

    return <NodeViewWrapper>
        <Popover>
            <PopoverTrigger asChild>
                <a
                    // href="#"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                >
                    <NodeViewContent as="span" >{getLabel(ref,type)}</NodeViewContent>
                </a>
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
                    <Button onClick={save}>Update</Button>
                </div>
            </PopoverContent>
        </Popover>

    </NodeViewWrapper>
}
