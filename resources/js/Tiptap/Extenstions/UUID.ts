import { Node } from "@tiptap/react";


export const UUID = Node.create({
    name:"uuid",
    addAttributes:()=>{

      return {
        id:{
            // default:crypto.randomUUID(),
            parseHTML: element => element.getAttribute('id') || crypto.randomUUID() ,
            renderHTML: attributes => ({ id: attributes.id || crypto.randomUUID()}),
            keepOnSplit:false
        },
        shouldUnique:{
            default:true,

        }
      }
    }

})
