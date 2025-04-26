import { createTable } from "@tiptap/extension-table";
import { Figure } from "./TipTapFigure";
import { uniqId } from "@/Utilities/UniqId";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { FigureTableComponent } from "../ReactComponents/FigureTable";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        figureTable: {
            addFigureTable: () =>boolean;
            deleteFigureTable:()=>ReturnType;
        };
    }
}


// export const FigureTable = Node.create({
//     name: "figureTable",
//     content: "table caption",
//     group:"block",
//     isolating: true,
//     draggable:true,


//     parseHTML() {
//         return [{ tag: 'figure[table="true"]' }];
//     },


//     renderHTML({ HTMLAttributes }) {
//         return [
//             "figure",
//             { ...HTMLAttributes, table: "true" },0
//         ];
//     },


//     addCommands():Partial<any> {
//         return {
//             addFigureTable:
//                 () =>
//                 ({ chain ,editor}: CommandProps) =>{
//                     const table = createTable(editor.schema,3,3,true).toJSON()
//                    chain()
//                         .insertContent({
//                             type: 'figureTable',
//                             attrs: { table: "true" },
//                             content: [
//                                 table,
//                                 {
//                                     type: "caption",
//                                     content: [{
//                                         type:"text",
//                                         text:"table caption"
//                                     }],
//                                 },
//                             ],
//                         })
//                        },
//                        deleteFigureTable: () => ({ editor, tr, dispatch }:CommandProps) => {
//                         return editor.commands.deleteNode(this.name);

//                     },



//         };
//     },
//     addProseMirrorPlugins() {
//         return [
//             new Plugin({
//                 props: {
//                   handleDOMEvents: {
//                     dragstart: (view, event) => {
//                       if (!event.target) {
//                         return false
//                       }

//                       const pos = view.posAtDOM(event.target as HTMLElement, 0)
//                       const $pos = view.state.doc.resolve(pos)

//                       if ($pos.parent.type === this.type) {
//                         event.preventDefault()
//                       }

//                       return false
//                     },
//                   },
//                 },
//               })
//         ]
//     },






// });


export const FigureTable = Figure.extend({

    name:"figureTable",
    content :"figcaption table",
    addAttributes(){

        return {
            ...this.parent?.(),
            groupId:{
            default:""
        }}
    },
    addCommands():any{
        return {
            addFigureTable:()=>
        this.editor
            .chain()
            .focus()
            .insertContent({
              type: 'figureTable',
              attrs:{
                figureId:uniqId()
              },

              content: [
                {
                    type: 'figcaption',
                    content: [
                      {
                        type: 'text',
                        text: 'Table caption',
                      },
                    ],
                  },
                createTable(this.editor.schema,3,3,true).toJSON(),

              ],
            }).run(),
            deleteFigureTable:()=> {return  this.editor
            .chain()
            .focus()
            .deleteNode('figureTable')}


        }


    },
    addNodeView() {

        return ReactNodeViewRenderer(FigureTableComponent)
    },
})
