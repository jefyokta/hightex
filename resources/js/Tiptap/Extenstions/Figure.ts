import { Node, mergeAttributes, type CommandProps } from "@tiptap/core";
import {CiteManager }from "bibtex.js";
import { CiteUtils } from "bibtex.js";

export type FigureOptions = {
  src: string;
  width?: string | undefined;
  caption: string;
  centered: boolean;
  cite?: string | undefined;
  label: string;
  comments?: string;
};

export const CenteredLabeledImage: string =
  "display:flex;flex-direction:column;align-items:center;";



export const Figure = Node.create<FigureOptions>({
  name: "figure",

  group: "block",

  content: "image figcaption",

  defining: true,
  isolating: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: {
        default: "",
      },
      width: {
        default: "200px",
      },
      caption: {
        default: "",
      },
      centered: {
        default: false,
      },
      cite: {
        default: "",
      },
      comments: {
        default: "",
      },
    };
  },
  addOptions: () => {
    return {
      src: "",
      width: "200px",
      caption: "",
      centered: true,
      cite: "",
      label: "",
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure",
        getAttrs(node): FigureOptions {
          return {
            src: node.getAttribute("src") || "",
            width: node.getAttribute("width") || undefined,
            caption: node.getAttribute("caption") || "",
            centered: node.getAttribute("centered") ? true : false,
            cite: node.getAttribute("cite") || undefined,
            label: node.getAttribute("label") || "",
          };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const label = 'exlabel';
    const { src, width, caption, centered, cite } = node.attrs;

    const ct = CiteManager.get(cite);

    return [
      "figure",
      mergeAttributes(HTMLAttributes, {
        id: label,
        style: centered ? CenteredLabeledImage : "",
      }),
      [
        "img",
        {
          src: src,
          style: `${width}`,
        },
      ],
      [
        "figcaption",
        {
          content: `${caption} ${ct ? new CiteUtils(ct).toCite() : ""}`,
        },
        caption,
      ],
    ];
  },

  addCommands():Partial<any> {
    return {
      setLabeledImage:
        (attrs: FigureOptions) =>
        ({ chain }:CommandProps) => {
          return chain()
            .insertContent({
              type: this.name,
              attrs,
              content: [
                {
                  type: "figcaption",
                  content: [
                    { type: "text", text: attrs.caption },
                  ],
                },
              ],
            }).run()
            ;
        },

      deleteLabeledImage:
        () =>
        ({ commands }:CommandProps) => {
          return commands.deleteNode(this.name);
        },
    };
  }


});
