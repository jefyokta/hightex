import ChapterProvider from "@/Utilities/ChapterProvider"
import { TableGroups } from "./table-groups"



export class Provider {

    private static containerp =  document.getElementById("container") as HTMLDivElement
    private static tablegroups = TableGroups
    
    static container():HTMLDivElement{
        return this.containerp
    }
    static chapter():number{
        return ChapterProvider.getchapter()
    }

    static tableGroups(){
        return this.tablegroups

    }
    static paragraphGroups(){

    }

    static referece(){

    }
    static orderedListGroups(){

    }



}
