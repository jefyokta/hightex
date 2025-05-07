import { Node } from "@tiptap/pm/model";
import { EditorView } from "@tiptap/pm/view";
import { Provider } from "@/Provider";


export type NodePos = {
  node: Node;
  pos: number;
};

type Page = {
  height: number;
  number: number;
};

export type NodePosMap = Map<number, NodePos>;

export class Paginate {
    private nodePos: NodePosMap = new Map();
    private pages: Page[] = [];

    constructor(private view: EditorView) {}

    static set(nodes: readonly Node[], view: EditorView) {
      const instance = new Paginate(view);
      instance.collectNodes(nodes);
      return instance;
    }

    private collectNodes(nodes: readonly Node[]) {
      this.nodePos.clear();
      nodes.forEach(node => {
        node.descendants((n, p) => {
          this.nodePos.set(p, { node: n, pos: p });
        });
      });
    }

    render() {
      this.pages = [];
      let contentHeight = 0;

      this.nodePos.forEach((np, key) => {
        const dom = this.view.nodeDOM(np.pos) as HTMLElement;
        if (dom) {
          const { height } = dom.getBoundingClientRect();

          if ((contentHeight + height) < Provider.maxPageHeight) {
            contentHeight += height;
          } else {
            if (np.node.type.name === 'figureImage') {
              this.pages.push({ height: contentHeight, number: key });
              contentHeight = 0;
            }

            if (np.node.type.name === 'paragraph') {
              if ((contentHeight + height) > Provider.defaultHeight.paragraph) {
                while (contentHeight < Provider.maxPageHeight) {
                  contentHeight += Provider.defaultHeight.paragraph;
                }
              }
              this.pages.push({ height: contentHeight, number: key });
              contentHeight = 0;
            }
          }
        }
      });

      this.drawBorders();
    }

    private drawBorders() {
      this.pages.forEach((p, i) => {
        const div = document.createElement('div');
        div.style.height = '0.5px';
        div.style.width = '100%';
        div.style.position = 'absolute';
        div.style.borderBottom = '0.5px dashed black';
        div.setAttribute('data-page', i.toString());
        div.style.top = `${p.height}px`;

        document.body.appendChild(div);
      });
    }
  }
