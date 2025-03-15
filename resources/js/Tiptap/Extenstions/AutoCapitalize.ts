import { Extension } from '@tiptap/core';
import { Plugin } from 'prosemirror-state';

const AutoCapitalize = Extension.create({
  name: 'autoCapitalize',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleTextInput(view, from, to, text) {
            const state = view.state;
            const { $from } = state.selection;
            const beforeText = state.doc.textBetween(0, $from.pos, ' ', ' ');
            const shouldCapitalize =
              beforeText.length === 0 || /[.!?]\s*$/.test(beforeText);

            const capitalizedText =
              shouldCapitalize && text.length > 0
                ? text.charAt(0).toUpperCase() + text.slice(1)
                : text;

            const tr = state.tr.insertText(capitalizedText, from, to);
            view.dispatch(tr);
            return true;
          },
        },
      }),
    ];
  },
});

export default AutoCapitalize;
