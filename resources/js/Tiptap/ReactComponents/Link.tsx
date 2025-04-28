import { Popover, PopoverTrigger, PopoverContent } from "@/Components/ui/popover";
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { useState } from "react";

export const LinkComponent = ({ node, updateAttributes }: NodeViewProps) => {
    const href = node.attrs.href || "";
    const [url, setUrl] = useState(href);

    const [content, setContent] = useState(node.attrs.content)

    const handleSave = () => {
        updateAttributes({ href: url });
    };

    return (
        <NodeViewWrapper className="link-component inline" data-type="link-component">
            <Popover>
                <PopoverTrigger >
                    <a
                        data-link-component
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                    >
                        {content || 'link'}
                    </a>
                    <NodeViewContent  ></NodeViewContent>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="link-url" className="text-sm text-neutral-700">Edit Link</label>
                        <Input
                            id="link-url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://..."
                        />
                        <Button className="bg-green-700" onClick={handleSave}>Update</Button>
                    </div>
                </PopoverContent>
            </Popover>
        </NodeViewWrapper>
    );
};
