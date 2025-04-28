
export default class ChapterProvider{

    private static chapter :number= 1;

    static getchapter(){
        return this.chapter
    }

    static setchapter(chapter:number){
        this.chapter = chapter;
    }

}
