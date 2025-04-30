import ChapterProvider from "@/Utilities/ChapterProvider"



export class Provider {

    private static containerp =  document.getElementById("container") as HTMLDivElement
    static container():HTMLDivElement{
        return this.containerp
    }
    static chapter():number{
        return ChapterProvider.getchapter()
    }

    static tableGroups(){

    }
    static paragraphGroups(){

    }

    static referece(){

    }
    static orderedListGroups(){

    }



}
