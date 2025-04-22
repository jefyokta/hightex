import { MIN_PARAGRAPH_HEIGHT } from "@/Tiptap/Pagination/constants/pagination";
import {Node as PMNode} from "@tiptap/pm/model"
import { EditorView } from "@tiptap/pm/view";

export const splitFigureTableNode = (
    figureTableNode: PMNode,
    availableHeight: number,
    view: EditorView
  ): PMNode[] => {
    const figcaption = figureTableNode.child(0);
    const table = figureTableNode.child(1);

    const rowGroups: PMNode[][] = [];
    let currentGroup: PMNode[] = [];
    let accumulatedHeight = 0;

    table.forEach((row, rowOffset) => {
      // get rows — asumsi kamu punya cara ukur seperti ini
      const rowDOM = view.nodeDOM(rowOffset + 1) as HTMLElement;
      const rowHeight = rowDOM?.getBoundingClientRect().height || MIN_PARAGRAPH_HEIGHT;

      if (accumulatedHeight + rowHeight > availableHeight && currentGroup.length > 0) {
        rowGroups.push(currentGroup);
        currentGroup = [];
        accumulatedHeight = 0;
      }

      currentGroup.push(row);
      accumulatedHeight += rowHeight;
    });

    if (currentGroup.length > 0) {
      rowGroups.push(currentGroup);
    }

    // Return array of new figureTable nodes
    return rowGroups.map((rows, index) => {
      const newTable = table.type.createChecked(table.attrs, rows);

      return figureTableNode.type.createChecked(
        figureTableNode.attrs,
        index === 0
          ? [figcaption, newTable]
          : [
              // Kalau kamu mau figcaption juga muncul di tiap pecahan, duplikasinya di sini
              figcaption.type.createChecked(figcaption.attrs, figcaption.content),
              newTable
            ]
      );
    });
  };
