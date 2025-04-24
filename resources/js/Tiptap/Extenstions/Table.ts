import Table from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { CommandProps, mergeAttributes } from '@tiptap/react';
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

const  getJustifyContent =(align:"center"|"left")=> {
    return align === 'center' ? 'center' :  'flex-start';
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
            style: `justify-content: center; display: flex; align-items: ${getJustifyContent(attributes.align)};`
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
        wrapper.style.flexDirection = "column";
        wrapper.style.alignItems = getJustifyContent(node.attrs.align);
        wrapper.style.justifyContent = "center";

        td.appendChild(wrapper);

        return {
          dom: td,
          contentDOM: wrapper,
          update(updatedNode) {
            if (updatedNode.type !== node.type) return false;

            td.setAttribute('align', updatedNode.attrs.align);
            td.setAttribute('colspan', updatedNode.attrs.colspan);
            td.setAttribute('rowspan', updatedNode.attrs.rowspan);
            wrapper.style.alignItems = getJustifyContent(updatedNode.attrs.align);

            return true;
          },
        };
      };
    },
    addCommands() {
      return {
        setCellAlignmentLeft: () => TableCommands.setCellAlignment("left"),
        setCellAlignmentRight: () => TableCommands.setCellAlignment("right"),
        setCellAlignmentCenter: () => TableCommands.setCellAlignment("center"),
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
              style: `justify-content: center; display: flex; align-items: ${getJustifyContent(attributes.align)};`
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
      const td = document.createElement('th');
      const wrapper = document.createElement('div');

      td.setAttribute('align', node.attrs.align);
      wrapper.style.display = 'flex';
      wrapper.style.flexDirection = "column";
      wrapper.style.alignItems = getJustifyContent(node.attrs.align);
      wrapper.style.justifyContent = "center";

      td.appendChild(wrapper);

      return {
        dom: td,
        contentDOM: wrapper,
        update(updatedNode) {
          if (updatedNode.type !== node.type) return false;

          td.setAttribute('align', updatedNode.attrs.align);
          td.setAttribute('colspan', updatedNode.attrs.colspan);
          td.setAttribute('rowspan', updatedNode.attrs.rowspan);
          wrapper.style.alignItems = getJustifyContent(updatedNode.attrs.align);

          return true;
        },
      };
    };
  },

});

 const CustomTable = Table.extend({
    addCommands():Partial<any> {
        return {
          ...this.parent?.(),
          deleteTable:
            () =>
            ({ state, dispatch }:CommandProps) => {
            //   console.log("Delete table is disabled!");
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
