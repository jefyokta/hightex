/**
 * @file /src/components/TipTap/utils/selection.ts
 * @name Selection
 * @description Utility functions for working with selections in the editor.
 */

import { Node as PMNode, ResolvedPos } from "@tiptap/pm/model";
import { EditorState, Selection, TextSelection, Transaction } from "@tiptap/pm/state";
import { Sign } from "../types/direction";
import { Nullable } from "../types/record";
import { isNodeEmpty } from "./nodes/node";
import { inRange } from "./math";

/**
 * Check if the editor is currently highlighting text.
 *
 * @param state - The current editor state.
 * @returns True if text is currently highlighted, false otherwise.
 */
export const isHighlighting = (state: EditorState): boolean => {
    const { from, to } = state.selection;
    return from !== to;
};

/**
 * Get the resolved position in the document.
 *
 * @param state - The current editor state.
 * @returns The resolved position in the document.
 */
export const getResolvedPosition = (state: EditorState): ResolvedPos => {
    const { from } = state.selection;
    const $pos = state.doc.resolve(from);
    return $pos;
};

/**
 * Set the selection at the specified anchor and head positions. If head is not provided,
 * it will be set to the anchor position.
 *
 * @param tr - The current transaction.
 * @param anchor - The anchor position.
 * @param head - The head position.
 * @returns The updated transaction.
 */
export const setSelectionAtPos = (tr: Transaction, anchor: number, head?: number): Transaction => {
    const selection = TextSelection.create(tr.doc, anchor, head ?? anchor);
    return setSelection(tr, selection);
};

/**
 * Set the selection to the specified selection object.
 *
 * @param tr - The current transaction.
 * @param selection - The selection object.
 * @returns The updated transaction.
 */
export const setSelection = <S extends Selection>(tr: Transaction, selection: S): Transaction => {
    console.log("Setting selection to", selection.$anchor.pos, "-", selection.$head.pos);
    return tr.setSelection(selection);
};

/**
 * Set the selection at the start of the document.
 *
 * @param tr - The current transaction.
 * @returns The updated transaction.
 */
export const setSelectionAtStartOfDocument = (tr: Transaction): Transaction => {
    return setSelectionAtPos(tr, 0);
};

/**
 * Set the selection at the end of the document.
 *
 * @param tr - The current transaction.
 * @returns The updated transaction.
 */
export const setSelectionAtEndOfDocument = (tr: Transaction): Transaction => {
    return setSelectionAtPos(tr, tr.doc.content.size);
};

/**
 * Set the selection to the start of the paragraph.
 *
 * @param tr - The current transaction.
 * @param paragraphPos - The position of the paragraph in the document.
 * @param paragraphNode - The paragraph node.
 * @returns {void}
 */
export const setSelectionToStartOfParagraph = (tr: Transaction, paragraphPos: number, paragraphNode: PMNode): void => {
    if (isNodeEmpty(paragraphNode)) {
        const selection = moveToThisTextBlock(tr, paragraphPos, 1);
        setSelection(tr, selection);
    } else {
        const paragraphStartPos = tr.doc.resolve(paragraphPos + 1);
        moveToNearestTextSelection(tr, paragraphStartPos, 1);
    }
};

/**
 * Set the selection to the paragraph with an optional offset.
 *
 * @param tr - The current transaction.
 * @param paragraphPos - The position of the paragraph in the document.
 * @param paragraphNode - The paragraph node.
 * @param offsetInNode - The offset in the paragraph node. Default is 0.
 * @returns {void}
 */
export const setSelectionToParagraph = (tr: Transaction, paragraphPos: number, paragraphNode: PMNode, offsetInNode: number = 0): void => {
    if (isNodeEmpty(paragraphNode)) {
        // Node will not have a text selection so move to the start of the paragraph
        setSelectionToStartOfParagraph(tr, paragraphPos, paragraphNode);
    } else {
        if (!inRange(offsetInNode, 0, paragraphNode.nodeSize - 1)) {
            console.warn("Cannot set selection: Invalid offset in node. Node is of size", paragraphNode.nodeSize);
            return;
        }

        const paragraphPosWithOffset = paragraphPos + offsetInNode;
        const $pos = tr.doc.resolve(paragraphPosWithOffset);
        moveToNearestTextSelection(tr, $pos, 1);
    }
};

/**
 * Set the selection to the end of the paragraph.
 *
 * @param tr - The current transaction.
 * @param paragraphPos - The position of the paragraph in the document.
 * @param paragraphNode - The paragraph node.
 * @returns {void}
 */
export const setSelectionToEndOfParagraph = (tr: Transaction, paragraphPos: number, paragraphNode: PMNode): void => {
    if (isNodeEmpty(paragraphNode)) {
        // Node will not have a text selection so move to the start=end of the paragraph
        setSelectionToStartOfParagraph(tr, paragraphPos, paragraphNode);
    } else {
        const paragraphEndPos = tr.doc.resolve(paragraphPos + paragraphNode.nodeSize - 1);
        moveToNearestTextSelection(tr, paragraphEndPos, -1);
    }
};

/**
 * Move the cursor to the previous text block.
 *
 * @param tr - The current transaction.
 * @param $pos - The resolved position in the document.
 * @returns {Selection} The new selection.
 */
export const moveToPreviousTextBlock = (tr: Transaction, $pos: ResolvedPos | number): Selection => {
    if (typeof $pos === "number") {
        return moveToPreviousTextBlock(tr, tr.doc.resolve($pos));
    }

    const prevPos = $pos.pos - 1;
    const prevResPos = tr.doc.resolve(prevPos);
    const searchDirection = -1;
    const selection = Selection.near(prevResPos, searchDirection);
    return selection;
};

/**
 * Caps the offset in the node to the length of the node.
 *
 * @param tr - The current transaction.
 * @param $pos - The resolved position in the document.
 * @param offsetInNode - The offset in the node.
 * @returns {number} The capped offset in the node.
 */
const capOffsetInNode = (tr: Transaction, $pos: ResolvedPos, offsetInNode: number): number => {
    const thisNode = tr.doc.nodeAt($pos.pos);
    if (!thisNode) {
        console.warn(`Unable to resolve node at position ${$pos.pos}. Capping offset to 0`);
        return offsetInNode;
    }

    return Math.min(offsetInNode, thisNode.nodeSize - 1);
};

/**
 * Move the cursor to the current text block.
 *
 * @param tr - The current transaction.
 * @param $pos - The resolved position in the document.
 * @param bias - The search direction. Default is 1 (forward).
 * @param offsetInNode - The offset in the node. Default is 0. Will cap at the length of the node.
 * @returns {Selection} The new selection.
 */
export const moveToThisTextBlock = (tr: Transaction, $pos: ResolvedPos | number, bias: Sign = 1, offsetInNode: number = 0): Selection => {
    if (typeof $pos === "number") {
        $pos = tr.doc.resolve($pos);
    }

    const adjustedOffset = capOffsetInNode(tr, $pos, offsetInNode);
    const offsetPos = $pos.pos + adjustedOffset;
    const $offsetPos = tr.doc.resolve(offsetPos);
    const selection = Selection.near($offsetPos, bias);
    return selection;
};

/**
 * Move the cursor to the next text block.
 *
 * @param tr - The current transaction.
 * @param $pos - The resolved position in the document.
 * @returns {Selection} The new selection.
 */
export const moveToNextTextBlock = (tr: Transaction, $pos: ResolvedPos | number): Selection => {
    if (typeof $pos === "number") {
        return moveToNextTextBlock(tr, tr.doc.resolve($pos));
    }

    const nextPos = $pos.pos + 1;
    const nextResPos = tr.doc.resolve(nextPos);
    const searchDirection = 1;
    const selection = Selection.near(nextResPos, searchDirection);
    return selection;
};

/**
 * Move the cursor to the nearest text selection.
 *
 * @param tr - The current transaction.
 * @param $pos - The resolved position in the document.
 * @param bias - The search direction.
 * @returns {void} The new selection.
 */
export const moveToNearestTextSelection = (tr: Transaction, $pos: ResolvedPos, bias: Sign = 1): void => {
    const textSelection = getNearestTextSelection($pos, bias);
    setSelection(tr, textSelection);
};

/**
 * Get the nearest text selection to the given position.
 *
 * @param $pos - The resolved position in the document.
 * @param bias - The search direction.
 * @returns {Selection} The nearest text selection.
 */
export const getNearestTextSelection = ($pos: ResolvedPos, bias: Sign = 1): Selection => {
    return TextSelection.near($pos, bias);
};

/**
 * Move the cursor to the nearest valid cursor position.
 *
 * @param tr - The current transaction.
 * @param $pos - The resolved position in the document.
 * @returns {Selection} The new selection.
 */
export const moveToNearestValidCursorPosition = ($pos: ResolvedPos): Nullable<Selection> => {
    const selection = Selection.findFrom($pos, 1, true) || Selection.findFrom($pos, -1, true);
    return selection;
};
