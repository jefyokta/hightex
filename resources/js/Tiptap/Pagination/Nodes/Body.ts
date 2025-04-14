/**
 * @file /src/Nodes/Body.ts
 * @name Body
 * @description The Body node situated within a page.
 */

import { Node, NodeViewRendererProps, mergeAttributes } from "@tiptap/core";
import { BODY_ATTRIBUTES, BODY_NODE_NAME } from "../constants/body";
import { isBodyNode } from "../utils/nodes/body/body";
import { parseHTMLNode } from "../utils/nodes/node";
import { calculateShorthandMargins, calculateBodyMargins } from "../utils/nodes/body/attributes/pageMargins";
import { mm } from "../utils/units";
import { calculateBodyDimensions } from "../utils/pageRegion/dimensions";
import { constructChildOnlyClipboardPlugin } from "../utils/clipboard";
import { addNodeAttributes } from "../utils/attributes/addAttributes";
import { getPageNodeAndPosition } from "../utils/nodes/page/pagePosition";

const baseElement = "div" as const;
const bodyAttribute = "data-page-body" as const;

export const BodyNode = Node.create({
    name: BODY_NODE_NAME,
    group: "block",
    content: "block*",
    defining: true,
    isolating: false,

    addAttributes() {
        return addNodeAttributes(BODY_ATTRIBUTES);
    },

    parseHTML() {
        return [parseHTMLNode(baseElement, bodyAttribute, true)];
    },

    renderHTML({ HTMLAttributes }) {
        return [baseElement, mergeAttributes(HTMLAttributes, { [bodyAttribute]: true, class: BODY_NODE_NAME }), 0];
    },

    addNodeView() {
        return (props: NodeViewRendererProps) => {
            const { editor, node, getPos } = props;
            const pos = getPos();

            const { node: pageNode } = getPageNodeAndPosition(editor.state.doc, pos);
            if (!pageNode) {
                throw new Error(`Page node not found from body node at position ${pos}`);
            }

            const dom = document.createElement(baseElement);
            dom.setAttribute(bodyAttribute, String(true));
            dom.classList.add(BODY_NODE_NAME);

            const { width, height } = calculateBodyDimensions(pageNode, node);
            const calculatedMargins = calculateBodyMargins(node);

            dom.style.height = mm(height);
            dom.style.width = mm(140);
            dom.style.margin = "3cm 3cm 4cm 4cm";

            dom.style.border = "1px solid #ccc";

            dom.style.overflow = "hidden";
            dom.style.position = "relative";

            const contentDOM = document.createElement(baseElement);
            dom.appendChild(contentDOM);

            return {
                dom,
                contentDOM,
            };
        };
    },

    addProseMirrorPlugins() {
        return [constructChildOnlyClipboardPlugin("bodyChildOnlyClipboardPlugin", this.editor.schema, isBodyNode)];
    },
});
