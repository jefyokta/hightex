/**
 * @file /src/Plugins/Pagination.ts
 * @name Pagination
 * @description Custom plugin for paginating the editor content.
 */

import { Editor } from "@tiptap/core";
import { Plugin, PluginKey, EditorState } from "@tiptap/pm/state";
import { EditorView } from "@tiptap/pm/view";
import { buildPageView } from "../utils/buildPageView";
import { isNodeEmpty } from "../utils/nodes/node";
import { doesDocHavePageNodes } from "../utils/nodes/page/page";
import { PaginationOptions } from "../PaginationExtension";

type PaginationPluginProps = {
    editor: Editor;
    options: PaginationOptions;
};

const PaginationPlugin = ({ editor, options }: PaginationPluginProps) => {
    return new Plugin({
        key: new PluginKey("pagination"),
        view() {
            let isPaginating = false;

            return {
                update(view: EditorView, prevState: EditorState) {
                    if (isPaginating) return;

                    const { state } = view;
                    const { doc, schema } = state;
                    const pageType = schema.nodes.page;

                    if (!pageType) return;

                    const docChanged = !doc.eq(prevState.doc);
                    const initialLoad = isNodeEmpty(prevState.doc) && !isNodeEmpty(doc);
                    const hasPageNodes = doesDocHavePageNodes(state);

                    if (!docChanged && hasPageNodes && !initialLoad) return;

                    isPaginating = true;

                    buildPageView(editor, view, options);

                    // Reset paginating flag regardless of success or failure because we do not want to get
                    // stuck out of this loop.
                    isPaginating = false;
                },
            };
        },
    });
};

export default PaginationPlugin;
