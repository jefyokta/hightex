import { Node, mergeAttributes } from "@tiptap/core";
import {CiteManager, CiteUtils }from "bibtex.js";

type CiteOptions = {
  cite: string;
  citeA?: boolean;
};

export const Cite = Node.create<CiteOptions>({
  name: "cite",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      cite: {
        default: "",
        parseHTML: (element) => element.getAttribute("cite") || "",
        renderHTML: (attributes) => ({ cite: attributes.cite }),
      },
      citeA: {
        default: false,
        parseHTML: (element) => element.hasAttribute("citeA"),
        renderHTML: (attributes) => (attributes.citeA ? { citeA: "true" } : {}),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "cite[cite]",
        attrs: {
          cite: this.options.cite,
          citeA: this.options.citeA,
        },
      },
    ];
  },

  renderHTML({ node }) {
    const cite = CiteManager.get(node.attrs.cite);
    if (!cite) {
      return [
        "cite",
        { class: "cite", cite: node.attrs.cite },
        "(Unknown citation!)",
      ];
    }
    const c = new CiteUtils(cite);

    return [
      "cite",
      mergeAttributes({ class: "cite", cite: cite.id }),
      node.attrs.citeA ? c.toCiteA() : c.toCite(),
    ];
  },

  addCommands(): any {
    return {
      insertCitation:
        (opt: CiteOptions) =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
            attrs: { cite: opt.cite, citeA: opt.citeA || false },
          });
        },
    };
  },
});
