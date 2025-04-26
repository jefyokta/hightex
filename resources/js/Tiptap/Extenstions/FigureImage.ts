import { uniqId } from "@/Utilities/UniqId";
import { Figure } from "./TipTapFigure"
import { CommandProps } from "@tiptap/react"

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        figureImage: {
            addFigureImage: (imgUrl:string) =>boolean;
        };
    }
}
export const FigureImage = Figure.extend({
    name:"imageFigure",
    content:"image figcaption",
 
    addCommands:():any =>{

        return {
            addFigureImage:(imgUrl:string)=>({editor}:CommandProps)=>{
               return editor.commands.insertContent({ type:'imageFigure',
                attrs:{
                    figureId:uniqId()
                },
                content:[
                    {
                        type:'image',
                        attrs:{
                            src:imgUrl
                        }

                    },
                    {
                        type:'figcaption',
                        text:"Image Caption"
                    }
                ]})

            }
        }



    }

})
