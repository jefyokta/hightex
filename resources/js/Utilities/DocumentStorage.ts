import Dexie from "dexie";

export default class DocumentStorage {
    private static db:Dexie|undefined;
    private static init(){
        this.db = new Dexie("document")
        this.db.version(1).stores({
            document:"bab,content,document_id"
        })
    }

    public static add(){
        this.db?.table('document').add({
            
        })
    }

}
