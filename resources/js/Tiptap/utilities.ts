import { Provider } from "@/Provider";
import { Node } from "@tiptap/pm/model";
import { EditorView } from "@tiptap/pm/view";
import { uniqId } from "@/Utilities/UniqId";
import { Fragment, Slice } from "@tiptap/pm/model";
import { Attribute, Editor, PasteRule } from "@tiptap/react";
import { Plugin, PluginKey } from 'prosemirror-state'


export type NodePos = {
    node:Node,
    pos:number
}

type Page =  {
    height:number;
    number:number;
}

type NodePosMap = Map<number,NodePos>

export const buildPageBorders = (nodepos:NodePosMap,view:EditorView)=>{
    const pages:Page[] = [];
    let contentHeight:number = 0;
    nodepos.forEach((np,key)=>{
        const dom = view.nodeDOM(np.pos) as HTMLElement
        if (dom) {
            const {height} = dom.getBoundingClientRect()
            dom.offsetHeight
            if ((contentHeight + height) < Provider.maxPageHeight) {
                contentHeight += height
            }else{
                if(np.node.type.name == 'figureImage'){
                pages.push({height:contentHeight,number:key})
            }
            if (np.node.type.name == 'paragraph') {
                if ((contentHeight + height) > Provider.defaultHeight.paragraph) {
                    let numSplit=0;
                   while (contentHeight < Provider.maxPageHeight) {
                    numSplit++
                    contentHeight += Provider.defaultHeight.paragraph

                   }
                }
                pages.push({height:contentHeight,number:key})

            }

            }
        }

    })

    drawBorder(pages)


}

const drawBorder = (pages:Page[])=>{
    pages.map((p,i)=>{
        const div =document.createElement('div')
        div.style.height = '.5px'
        div.style.width = '100%'
        div.style.display = 'absolute'
        // div.style.transform
    })

}

export const getNodesPos = (nodes:readonly Node[])=>{

    const map:NodePosMap=  new Map;
    nodes.map((node,i)=>{
        node.descendants((n,p)=>{
            map.set(i,{node:n,pos:p})
        })

    })

    return map

}

export const nodeHandler= ()=>{

}







export const ensureUniqueId =(editor:Editor)=>{
    const transaction = editor.state.tr
    const seenIds = new Set<string>()
    editor.state.doc.descendants((node, pos) => {
        if (node.attrs.shouldUnique) {
            let id = node.attrs.id
            if (!id) {
                id = `${node.type.name}-${uniqId()}`
                transaction.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    id,
                })
                seenIds.add(id)
            } else {
                if (seenIds.has(id)) {
                    const newId = `${node.type.name}-${uniqId()}`
                    transaction.setNodeMarkup(pos, undefined, {
                        ...node.attrs,
                        id: newId,
                    })
                    seenIds.add(newId)
                    console.warn(`Duplicate id found at pos ${pos}. Changed id from ${id} to ${newId}`)
                } else {
                    seenIds.add(id)
                }
            }
        }
    })

    if (transaction.docChanged) {
        editor.view.dispatch(transaction)
    }
}



export interface NodePasteRuleConfig {
  find: (node: Node) => boolean;
  handler: (props: { node: Node }) => Node;
}

export function NodePasteRule(config: NodePasteRuleConfig) {
  return new Plugin({
    props: {
      transformPasted(slice) {
        const fragment = mapFragment(slice.content, config);
        return new Slice(fragment,slice.openStart,slice.openEnd);
      },
    },
  });
}

const mapFragment =(fragment: Fragment, config: NodePasteRuleConfig) =>{
  const children:Node[] = [];
  fragment.forEach(node => {
    let newNode = node;
    if (config.find(node)) {
      newNode = config.handler({ node });
    }
    children.push(newNode);
  });
  return Fragment.fromArray(children);
}


