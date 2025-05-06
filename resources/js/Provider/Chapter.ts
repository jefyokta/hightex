export class Chapter {
private static chapter:number;

static set(chapter:number){
    this.chapter=chapter
}

static get(){

    return this.chapter
}
}
