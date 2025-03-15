import Table from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { CommandProps } from '@tiptap/react';
import { CellSelection } from "prosemirror-tables";

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableCell: {
      setCellAlignmentLeft: () => ReturnType,
      setCellAlignmentRight: () => ReturnType,
      setCellAlignmentCenter: () => ReturnType,
    }
  }
}

const TableCommands = {
    setCellAlignment:
    (alignment: "left" | "center" | "right") =>
    ({ commands, state }: CommandProps) => {
      const { selection } = state;

      if (selection instanceof CellSelection) {
        return commands.command(({ tr }) => {
          selection.forEachCell((node,pos) => {
            tr.setNodeMarkup(pos, node.type, { ...node.attrs, align: alignment });
          });
          return true;
        });
      }

      const node = selection.$from.node(selection.$from.depth - 1);

      if (!node) return false;

      if (["tableHeader", "tableCell"].includes(node.type.name)) {
        return commands.updateAttributes(node.type.name, { align: alignment });
      }

      return false;
    },
  };


const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'left',
        parseHTML: element => element.style.textAlign || 'left',
        renderHTML: attributes => ({
          style: `text-align: ${attributes.align}; display: flex; justify-content: ${
            attributes.align === 'center' ? 'center' : attributes.align === 'right' ? 'flex-end' : 'flex-start'
          };`
        }),
      },
    };
  },
  addNodeView() {
    return ({ node }) => {
      const td = document.createElement('td');
      const wrapper = document.createElement('div');
      td.setAttribute('align', node.attrs.align);
      wrapper.style.display = 'flex';
      wrapper.style.flexDirection = "row"
    //   wrapper.style.width = '100%';
      wrapper.style.alignItems = "center";
      wrapper.style.justifyContent = node.attrs.align === 'center' ? 'center' : node.attrs.align === 'right' ? 'flex-end' : 'flex-start';
      td.appendChild(wrapper);
      return {
        dom: td,
        contentDOM: wrapper,
        update(updatedNode) {
          if (updatedNode.type !== node.type) return false;
          node = updatedNode;
          td.setAttribute('align', node.attrs.align);
          td.setAttribute('colspan',node.attrs.colspan)
          td.setAttribute('rowspan',node.attrs.rowspan)
          wrapper.style.justifyContent = node.attrs.align === 'center' ? 'center' : node.attrs.align === 'right' ? 'flex-end' : 'flex-start';
          return true;
        },
      };
    };
  },
  addCommands(): Partial<any> {
    return {
      setCellAlignmentLeft: () =>
        TableCommands.setCellAlignment("left"),
      setCellAlignmentRight: () =>
        TableCommands.setCellAlignment("right"),
      setCellAlignmentCenter: () =>
        TableCommands.setCellAlignment("center")
    };
  },
});

const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'left',
        parseHTML: element => element.style.textAlign || 'left',
        renderHTML: attributes => ({
          style: `text-align: ${attributes.align}; display: flex; justify-content: ${
            attributes.align === 'center' ? 'center' : attributes.align === 'right' ? 'flex-end' : 'flex-start'
          };`
        }),
      },
    };
  },
  addCommands(): Partial<any> {
    return {
      setCellAlignmentLeft: () =>
        TableCommands.setCellAlignment("left"),
      setCellAlignmentRight: () =>
        TableCommands.setCellAlignment("right"),
      setCellAlignmentCenter: () =>
        TableCommands.setCellAlignment("center")
    };
  },
  addNodeView() {
    return ({ node }) => {
      const th = document.createElement("th");
      const wrapper = document.createElement("div");

      th.setAttribute('align', node.attrs.align);
      wrapper.style.display = "flex";
      wrapper.style.flexDirection = "column"

      wrapper.style.width = "100%";
      wrapper.style.height ="100%"
      wrapper.style.alignItems = "center";

      if (node.attrs.align === "left") {
        wrapper.style.justifyContent = "flex-start";
      } else if (node.attrs.align === "center") {
        wrapper.style.justifyContent = "center";
      } else if (node.attrs.align === "right") {
        wrapper.style.justifyContent = "flex-end";
      }

      th.appendChild(wrapper);

      return {
        dom: th,
        contentDOM: wrapper,
        update(updatedNode) {
          if (updatedNode.type !== node.type) return false;

          node = updatedNode;
          th.setAttribute('align', node.attrs.align);
          th.setAttribute('colspan',node.attrs.colspan)
          th.setAttribute('rowspan',node.attrs.rowspan)


          wrapper.style.justifyContent =
            node.attrs.align === "center"
              ? "center"
              : node.attrs.align === "right"
              ? "flex-end"
              : "flex-start";

          return true;
        },
      };
    };
  }

});

 const CustomTable = Table.extend({
    addCommands():Partial<any> {
        return {
          ...this.parent?.(),
          deleteTable:
            () =>
            ({ state, dispatch }:CommandProps) => {
            //   console.log("🚫 Delete table is disabled!");
              return true;
            },

      };
    },
  });

export {
  CustomTableCell as TableCell,
  CustomTableHeader as TableHeader,
  CustomTable as Table
};
