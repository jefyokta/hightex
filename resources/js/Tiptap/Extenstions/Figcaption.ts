import { Node } from "@tiptap/core";

type FigCaptionProps = {
  content: any;
};

export const FigCaption = Node.create<FigCaptionProps>({
  name: "figcaption",
  content: "inline* cite",
  parseHTML() {
    return [{ tag: "figcaption" }];
  },
  selectable: false,
  draggable: false,
  atom: false,
  renderHTML({ node, HTMLAttributes }) {
    return ["figcaption", HTMLAttributes, node.attrs.content];
  },
});
