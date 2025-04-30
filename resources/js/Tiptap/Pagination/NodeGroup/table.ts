import { TableMeasurement } from "../types/table";


type TableGroupResult= {
    key:string,
    value:TableMeasurement

}


export class TableGroup  {
    private static map = new Map<string,TableMeasurement>



    public static set(key:string,val:TableMeasurement){
        this.map.set(key,val);
    }

    public static init(data:TableGroupResult[]) {
        for (let i = 0; i < data.length;i++) {
            this.set(data[i].key,data[i].value)

        }
    }

    static getMap(){

        return this.map
    }

}
