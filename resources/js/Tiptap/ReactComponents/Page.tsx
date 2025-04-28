import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import React from "react"



const Page: React.FC<NodeViewProps> = ({ node }) => {
    return (<NodeViewWrapper {...node.attrs} >
        <NodeViewContent></NodeViewContent>
    </NodeViewWrapper>)
}
