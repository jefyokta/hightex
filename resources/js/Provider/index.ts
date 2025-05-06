import { Chapter } from "./Chapter";




export class Provider {

    // page height - vertical margins (29.7cm -4cm -3cm )in px
    public static readonly maxPageHeight:number = 857.95275591;
    public static readonly defaultHeight:Record<string,number> = {
        paragraph:24

    }

    public static chapter(){
        return Chapter.get()
    }





}








