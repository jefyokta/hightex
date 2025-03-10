import { TableCell } from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

 const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'left',
        parseHTML: element => element.style.textAlign || 'left',
        renderHTML: attributes => {
          return attributes.align ? { style: `text-align: ${attributes.align};` } : {};
        },
      },
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
          renderHTML: attributes => {
            return attributes.align ? { style: `text-align: ${attributes.align};` } : {};
          },
        },
      };
    },
  });

  export {
    CustomTableCell as TableCell,
    CustomTableHeader as TableHeader
  }
