import { Node, mergeAttributes } from "@tiptap/core";
import Image from "@tiptap/extension-image";

declare module "@tiptap/core"{

    interface Commands<ReturnType>{
        cimage:{
            deleteImage:()=>ReturnType,
        }
    }
}
 const ResizableImage = Image.extend({
  name: "image",

  addOptions() {
    return {
    ...this.parent?.(),
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: { default: null },
      width: { default: "200px" },
      height: { default: "auto" },
    };
  },

//   group: "block",
  draggable: true,
  selectable: true,

  parseHTML() {
    return [
      {
        tag: "img",
        getAttrs: (dom) => {
          const element = dom as HTMLImageElement;
          return {
            src: element.getAttribute("src"),
            width: element.getAttribute('width')|| "200px",
            height: element.style.height || "auto",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes ,node}) {
    return ["img", mergeAttributes(HTMLAttributes, { style: `cursor: nwse-resize;`,width:node.attrs.width })];
  },

  addNodeView() {
    return ({ node, editor ,getPos}) => {
      const img = document.createElement("img");
      img.src = node.attrs.src;
      img.style.width = node.attrs.width;
      img.style.cursor = "nwse-resize";
      img.style.userSelect = "none";

      let startX: number, startWidth: number;
      const startResize = (event: MouseEvent) => {
        event.preventDefault();
        startX = event.clientX;
        startWidth = img.offsetWidth;

        const doResize = (moveEvent: MouseEvent) => {
            const newWidth = Math.max(50, startWidth + (moveEvent.clientX - startX));
            img.style.width = `${newWidth}px`;


            requestAnimationFrame(() => {
                const {state,view} = this.editor

                const {$anchor} = state.selection

                const nodes =$anchor.nodeAfter || $anchor.parent;
                let node;
                if(nodes.type.name =='image'){
                    node = nodes
                }else if(nodes.type.name === 'imageFigure'){
                    node =nodes.content.firstChild
                }
                console.log(node)
                if (!node) return;
                const tr = state.tr.setNodeMarkup($anchor.pos, node.type, {
                    ...node.attrs,
                    width: `${newWidth}px`,
                  });
                  view.dispatch(tr);




            });
          };


        const stopResize = () => {
          document.removeEventListener("mousemove", doResize);
          document.removeEventListener("mouseup", stopResize);
        };

        document.addEventListener("mousemove", doResize);
        document.addEventListener("mouseup", stopResize);
      };

      img.addEventListener("mousedown", (event) => {
        event.preventDefault();
        editor.chain().focus().setNodeSelection(getPos()).run();
        if (event.button === 0) {
          startResize(event);
        }
      });

      return { dom: img,
        update(updateNode:any) {
            if (node.type !== updateNode.type) {
              return false;
            }
            img.style.width = updateNode.attrs.width;
            img.setAttribute("width", updateNode.attrs.width);

            return true;
          }, };
    };
  },
  addCommands():Partial<any>{

    return {
        deleteImage:()=>{

            const {$anchor} = this.editor.state.selection
            const node = $anchor.nodeAfter || $anchor.parent
            console.log(node,$anchor.nodeAfter,$anchor.parent,$anchor.nodeBefore);
            return true;

        }
    }



  }


});

export {
    ResizableImage as Image
}
