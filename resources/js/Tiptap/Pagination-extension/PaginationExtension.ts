/**
 * @file /src/PaginationExtension.ts
 * @name Pagination
 * @description Custom pagination extension for the Tiptap editor.
 */

import { Extension } from "@tiptap/core";
import { DEFAULT_PAPER_SIZE } from "./constants/paperSize";
import { DEFAULT_PAPER_COLOUR } from "./constants/paperColours";
import { DEFAULT_PAGE_MARGIN_CONFIG } from "./constants/pageMargins";
import { DEFAULT_PAPER_ORIENTATION } from "./constants/paperOrientation";
import { PAGE_NODE_ATTR_KEYS } from "./constants/page";
import { PAGINATION_EXTENSION_NAME } from "./constants/pagination";
import { DEFAULT_PAGE_BORDER_CONFIG } from "./constants/pageBorders";
import { DEFAULT_PAGE_AMENDMENT_CONFIG } from "./constants/pageAmendment";
import { BODY_NODE_ATTR_KEYS } from "./constants/body";
import { PaperOrientation, PaperSize } from "./types/paper";
import { PageAmendmentOptions } from "./types/pageAmendment";
import { BorderConfig, MultiSide, MarginConfig } from "./types/page";
import KeymapPlugin from "./Plugins/Keymap";
import PaginationPlugin from "./Plugins/Pagination";
import { isPageNode } from "./utils/nodes/page/page";
import { getPageNodePosByPageNum } from "./utils/nodes/page/pageNumber";
import { isValidPaperSize, pageNodeHasPageSize, setPageNodePosPaperSize, setPagePaperSize } from "./utils/nodes/page/attributes/paperSize";
import { getDefaultPaperColour, setPageNodePosPaperColour } from "./utils/nodes/page/attributes/paperColour";
import { setBodyNodesAttribute, setPageNodesAttribute } from "./utils/nodes/page/attributes/setPageAttributes";
import { setPageNodePosPaperOrientation } from "./utils/nodes/page/attributes/paperOrientation";
import { isMarginValid, isValidPageMargins, setBodyNodePosPageMargins, updateBodyMargin } from "./utils/nodes/body/attributes/pageMargins";
import { isBorderValid, isValidPageBorders, setPageNodePosPageBorders, updatePageBorder } from "./utils/nodes/page/attributes/pageBorders";
import { setDocumentSideConfig, setDocumentSideValue, setPageSideConfig, setPageSideValue } from "./utils/setSideConfig";

export interface PaginationOptions {
    /**
     * The default paper size for the document. Note this is only the default
     * so you can have settings in your editor which change the paper size.
     * This is only the setting for new documents.
     *
     * @default "A4"
     * @example "A3"
     */
    defaultPaperSize: PaperSize;

    /**
     * The default paper colour for the document. Note this is only the default
     * so you can have settings in your editor which change the paper colour.
     * This is only the setting for new documents.
     *
     * @default "#fff"
     * @example "#f0f0f0"
     */
    defaultPaperColour: string;

    /**
     * Whether to use the device theme to set the paper colour.
     * If enabled, the default paper colour will be ignored.
     *
     * @default false
     * @example true | false
     */
    useDeviceThemeForPaperColour: boolean;

    /**
     * The default paper orientation for the document. Note this is only the default
     * so you can have settings in your editor which change the paper orientation.
     * This is only the setting for new documents.
     *
     * @default "portrait"
     * @example "portrait" | "landscape"
     */
    defaultPaperOrientation: PaperOrientation;

    /**
     * The default margin configuration for the document. Note this is only the default
     * so you can have settings in your editor which change the margin configuration.
     * This is only the setting for new documents.
     *
     * @default { top: 25.4, right: 25.4, bottom: 25.4, left: 25.4 }
     * @example { top: 10, right: 10, bottom: 10, left: 10 }
     */
    defaultMarginConfig: MarginConfig;

    /**
     * The default border configuration for the document. This controls the thickness
     * of the borders on the page. Note this is only the default so you can have
     * settings in your editor which change the border configuration. This is only
     * the setting for new documents.
     *
     * @default { top: 1, right: 1, bottom: 1, left: 1 }
     * @example { top: 2, right: 2, bottom: 2, left: 2 }
     */
    defaultPageBorders: BorderConfig;

    /**
     * Options for page amendments (header and footer).
     *
     * @see {@link PageAmendmentOptions}
     * @example { enableHeader: true, enableFooter: false }
     */
    pageAmendmentOptions: PageAmendmentOptions;
}

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        page: {
            /**
             * Set the paper size.
             *
             * @param paperSize The paper size
             * @example editor.commands.setDocumentPaperSize("A4")
             */
            setDocumentPaperSize: (paperSize: PaperSize) => ReturnType;

            /**
             * Set the default paper size.
             *
             * @example editor.commands.setDocumentDefaultPaperSize()
             */
            setDocumentDefaultPaperSize: () => ReturnType;

            /**
             * Set the paper size for a specific page.
             *
             * @param pageNum The page number (0-indexed)
             * @param paperSize The paper size
             * @example editor.commands.setPagePaperSize(0, "A4")
             */
            setPagePaperSize: (pageNum: number, paperSize: PaperSize) => ReturnType;

            /**
             * Checks the paper sizes are set for each page in the document.
             * Sets the default paper size if not set.
             *
             * @example editor.commands.checkPaperSizes()
             */
            checkPaperSizes: () => ReturnType;

            /**
             * Set the paper colour for the document.
             *
             * @param paperColour The paper colour
             * @example editor.commands.setDocumentPaperColour("#fff")
             */
            setDocumentPaperColour: (paperColour: string) => ReturnType;

            /**
             * Set the default paper colour.
             *
             * @example editor.commands.setDocumentDefaultPaperColour()
             */
            setDocumentDefaultPaperColour: () => ReturnType;

            /**
             * Set the paper colour for a specific page.
             *
             * @param pageNum The page number (0-indexed)
             * @param paperColour The paper colour
             * @example editor.commands.setPagePaperColour(0, "#fff")
             */
            setPagePaperColour: (pageNum: number, paperColour: string) => ReturnType;

            /**
             * Set the paper orientation for the document
             *
             * @param paperOrientation The paper orientation
             * @example editor.commands.setDocumentPaperOrientation("portrait") | editor.commands.setDocumentPaperOrientation("landscape")
             */
            setDocumentPaperOrientation: (paperOrientation: PaperOrientation) => ReturnType;

            /**
             * Set the default paper orientation for all pages in the document.
             *
             * @example editor.commands.setDocumentDefaultPaperOrientation()
             */
            setDocumentDefaultPaperOrientation: () => ReturnType;

            /**
             * Set the paper orientation for a specific page
             *
             * @param pageNum The page number (0-indexed)
             * @param paperOrientation The paper orientation
             * @example editor.commands.setPagePaperOrientation(0, "portrait") | editor.commands.setPagePaperOrientation(0, "landscape")
             */
            setPagePaperOrientation: (pageNum: number, paperOrientation: PaperOrientation) => ReturnType;

            /**
             * Set the page margins for the document.
             *
             * @param pageMargins The page margins (top, right, bottom, left)
             * @example editor.commands.setDocumentPageMargins({ top: 10, right: 15, bottom: 10, left: 15 })
             */
            setDocumentPageMargins: (pageMargins: MarginConfig) => ReturnType;

            /**
             * Set the default page margins.
             *
             * @example editor.commands.setDocumentDefaultPageMargins()
             */
            setDocumentDefaultPageMargins: () => ReturnType;

            /**
             * Set the page margins for a specific page.
             *
             * @param pageNum The page number (0-indexed)
             * @param pageMargins The page margins
             * @example editor.commands.setPagePageMargins(0, { top: 10, right: 15, bottom: 10, left: 15 })
             */
            setPagePageMargins: (pageNum: number, pageMargins: MarginConfig) => ReturnType;

            /**
             * Set a margin for the document on a specific side.
             *
             * @param margin The margin to set (top, right, bottom, left, x, y, all)
             * @param value The value to set the margin to
             * @example editor.commands.setDocumentPageMargin("top", 10)
             */
            setDocumentPageMargin: (margin: MultiSide, value: number) => ReturnType;

            /**
             * Set a margin for a specific page on a specific side.
             *
             * @param pageNum The page number (0-indexed)
             * @param margin The margin to set (top, right, bottom, left, x, y, all)
             * @param value The value to set the margin to
             * @example editor.commands.setPagePageMargin(0, "top", 10)
             */
            setPagePageMargin: (pageNum: number, margin: MultiSide, value: number) => ReturnType;

            /**
             * Set the page borders for the document.
             *
             * @param pageBorders The page borders (top, right, bottom, left)
             * @example editor.commands.setDocumentPageBorders({ top: 2, right: 2, bottom: 2, left: 2 })
             */
            setDocumentPageBorders: (pageBorders: BorderConfig) => ReturnType;

            /**
             * Set the default page borders.
             *
             * @example editor.commands.setDocumentDefaultPageBorders()
             */
            setDocumentDefaultPageBorders: () => ReturnType;

            /**
             * Set the page borders for a specific page.
             *
             * @param pageNum The page number (0-indexed)
             * @param pageBorders The page borders
             * @example editor.commands.setPageBorders(0, { top: 2, right: 2, bottom: 2, left: 2 })
             */
            setPageBorders: (pageNum: number, pageBorders: BorderConfig) => ReturnType;

            /**
             * Set a border for the document on a specific side.
             *
             * @param border The border to set (top, right, bottom, left, all)
             * @param value The value to set the border to
             */
            setDocumentPageBorder: (border: MultiSide, value: number) => ReturnType;

            /**
             * Set a border for a specific page on a specific side.
             *
             * @param pageNum The page number (0-indexed)
             * @param border The border to set (top, right, bottom, left, all)
             * @param value The value to set the border to
             */
            setPagePageBorder: (pageNum: number, border: MultiSide, value: number) => ReturnType;
        };
    }
}

const PaginationExtension = Extension.create<PaginationOptions>({
    name: PAGINATION_EXTENSION_NAME,

    addOptions() {
        return {
            defaultPaperSize: DEFAULT_PAPER_SIZE,
            defaultPaperColour: DEFAULT_PAPER_COLOUR,
            useDeviceThemeForPaperColour: false,
            defaultPaperOrientation: DEFAULT_PAPER_ORIENTATION,
            defaultMarginConfig: DEFAULT_PAGE_MARGIN_CONFIG,
            defaultPageBorders: DEFAULT_PAGE_BORDER_CONFIG,
            pageAmendmentOptions: DEFAULT_PAGE_AMENDMENT_CONFIG,
        };
    },

    onCreate() {
        this.editor.commands.checkPaperSizes();
    },

    addProseMirrorPlugins() {
        const { editor, options } = this;
        return [KeymapPlugin, PaginationPlugin({ editor, options })];
    },

    addCommands() {
        return {
            setDocumentPaperSize:
                (paperSize: PaperSize) =>
                ({ tr, dispatch }) => {
                    if (!dispatch) return false;

                    if (!isValidPaperSize(paperSize)) {
                        console.warn(`Invalid paper size: ${paperSize}`);
                        return false;
                    }

                    setPageNodesAttribute(tr, PAGE_NODE_ATTR_KEYS.paperSize, paperSize);

                    dispatch(tr);
                    return true;
                },

            setDocumentDefaultPaperSize:
                () =>
                ({ commands }) =>
                    commands.setDocumentPaperSize(this.options.defaultPaperSize),

            setPagePaperSize:
                (pageNum: number, paperSize: PaperSize) =>
                ({ tr, dispatch }) => {
                    const { doc } = tr;

                    const pageNodePos = getPageNodePosByPageNum(doc, pageNum);
                    if (!pageNodePos) {
                        return false;
                    }

                    const { pos: pagePos, node: pageNode } = pageNodePos;

                    return setPageNodePosPaperSize(tr, dispatch, pagePos, pageNode, paperSize);
                },

            checkPaperSizes:
                () =>
                ({ tr, dispatch }) => {
                    const { doc } = tr;
                    const paperSizeUpdates: boolean[] = [];
                    doc.forEach((node, pos) => {
                        if (isPageNode(node)) {
                            if (!pageNodeHasPageSize(node)) {
                                paperSizeUpdates.push(setPagePaperSize(tr, dispatch, pos, this.options.defaultPaperSize));
                            }
                        }
                    });

                    // If any page sizes were updated
                    return paperSizeUpdates.some((update) => update);
                },

            setDocumentPaperColour:
                (paperColour: string) =>
                ({ tr, dispatch }) => {
                    if (!dispatch) return false;

                    setPageNodesAttribute(tr, PAGE_NODE_ATTR_KEYS.paperColour, paperColour);

                    dispatch(tr);
                    return true;
                },

            setDocumentDefaultPaperColour:
                () =>
                ({ editor, commands }) => {
                    const defaultPaperColour = getDefaultPaperColour(editor);
                    return commands.setDocumentPaperColour(defaultPaperColour);
                },

            setPagePaperColour:
                (pageNum: number, paperColour: string) =>
                ({ tr, dispatch }) => {
                    const { doc } = tr;

                    const pageNodePos = getPageNodePosByPageNum(doc, pageNum);
                    if (!pageNodePos) {
                        return false;
                    }

                    const { pos: pagePos, node: pageNode } = pageNodePos;

                    return setPageNodePosPaperColour(tr, dispatch, pagePos, pageNode, paperColour);
                },

            setDocumentPaperOrientation:
                (paperOrientation: PaperOrientation) =>
                ({ tr, dispatch }) => {
                    if (!dispatch) return false;

                    setPageNodesAttribute(tr, PAGE_NODE_ATTR_KEYS.paperOrientation, paperOrientation);

                    dispatch(tr);
                    return true;
                },

            setDocumentDefaultPaperOrientation:
                () =>
                ({ commands }) =>
                    commands.setDocumentPaperOrientation(this.options.defaultPaperOrientation),

            setPagePaperOrientation:
                (pageNum: number, paperOrientation: PaperOrientation) =>
                ({ tr, dispatch }) => {
                    const { doc } = tr;

                    const pageNodePos = getPageNodePosByPageNum(doc, pageNum);
                    if (!pageNodePos) {
                        return false;
                    }

                    const { pos: pagePos, node: pageNode } = pageNodePos;

                    return setPageNodePosPaperOrientation(tr, dispatch, pagePos, pageNode, paperOrientation);
                },

            setDocumentPageMargins: setDocumentSideConfig(BODY_NODE_ATTR_KEYS.pageMargins, isValidPageMargins, setBodyNodesAttribute),

            setDocumentDefaultPageMargins:
                () =>
                ({ commands }) =>
                    commands.setDocumentPageMargins(this.options.defaultMarginConfig),

            setPagePageMargins: setPageSideConfig(getPageNodePosByPageNum, setBodyNodePosPageMargins),

            setDocumentPageMargin:
                (margin: MultiSide, value: number) =>
                ({ tr, dispatch, commands }) =>
                    setDocumentSideValue(commands.setDocumentPageMargins, isMarginValid, updateBodyMargin)(margin, value)({
                        tr,
                        dispatch,
                    }),

            setPagePageMargin:
                (pageNum: number, margin: MultiSide, value: number) =>
                ({ tr, dispatch, commands }) =>
                    setPageSideValue(commands.setPagePageMargins, isMarginValid, updateBodyMargin)(pageNum, margin, value)({
                        tr,
                        dispatch,
                    }),

            setDocumentPageBorders: setDocumentSideConfig(PAGE_NODE_ATTR_KEYS.pageBorders, isValidPageBorders, setPageNodesAttribute),

            setDocumentDefaultPageBorders:
                () =>
                ({ commands }) =>
                    commands.setDocumentPageBorders(this.options.defaultPageBorders),

            setPageBorders: setPageSideConfig(getPageNodePosByPageNum, setPageNodePosPageBorders),

            setDocumentPageBorder:
                (border: MultiSide, value: number) =>
                ({ tr, dispatch, commands }) =>
                    setDocumentSideValue(commands.setDocumentPageBorders, isBorderValid, updatePageBorder)(border, value)({
                        tr,
                        dispatch,
                    }),

            setPagePageBorder:
                (pageNum: number, border: MultiSide, value: number) =>
                ({ tr, dispatch, commands }) =>
                    setPageSideValue(commands.setPageBorders, isBorderValid, updatePageBorder)(pageNum, border, value)({
                        tr,
                        dispatch,
                    }),
        };
    },
});

export default PaginationExtension;
