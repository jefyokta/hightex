import { Provider } from "@/Provider";
import { TableGroup } from "@/Tiptap/Pagination/types/table";
import { Node } from "@tiptap/pm/model";
import { Editor } from "@tiptap/react";



export class TableManager {

    /**
     *preparing object tables
     * @param pages
     */

     static init( pages: readonly Node[]) {
        const tmpMap = Provider.tableGroups()
        pages.forEach(page => {
          page.descendants((node, pos) => {
            if (node.type.name === 'figureTable' && node.attrs.groupId) {
              tmpMap.set(node.attrs.groupId, {
                originalTable: node,
                tables: [node],
                positions: [pos]
              })
            }
            if (node.type.name === 'splittedTable' && node.attrs.groupId) {
              const group = tmpMap.get(node.attrs.groupId)
              console.log(group)
              if (group) {
                group.tables.push(node)
                group.positions.push(pos)
              }
            }
          })
        })


      }

}
