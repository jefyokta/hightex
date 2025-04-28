import { Label } from "@/Components/ui/field"
import { Input } from "@/Components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover"
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import katex from "katex"
import { useEffect, useRef, useState } from "react"
import { TextArea } from "react-aria-components"

export const MathBlockComponent: React.FC<NodeViewProps> = ({ node }) => {

    const [latex, setLatex] = useState(node.attrs.latex)
    const containerRef = useRef<HTMLDivElement>()

    useEffect(() => {
        katex.render(latex, containerRef.current as HTMLDivElement, { throwOnError: false })
    }, [latex])
    return <NodeViewWrapper>

        <div className="flex justify-center">
            <Popover>
                <PopoverTrigger className="hover:bg-black/20 focus:bg-black/20 rounded-md">
                    <div ref={containerRef as any} />
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">LaTeX</h4>
                            <p className="text-sm text-muted-foreground">
                                Set the Latex to render math
                            </p>
                        </div>
                        <div className="w-full flex flex-col space-y-2">
                            <TextArea placeholder="\LaTeX" value={latex} className={`focus:outline-none`} onChange={(e)=>setLatex(e.target.value)}></TextArea>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    </NodeViewWrapper>
}
