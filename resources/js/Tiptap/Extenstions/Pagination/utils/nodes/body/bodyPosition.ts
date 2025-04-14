/**
 * @file /src/utils/nodes/body/bodyPosition.ts
 * @name BodyPosition
 * @description Utility functions for the body position node.
 */

import { Node as PMNode, ResolvedPos } from "@tiptap/pm/model";
import { Nullable } from "../../../types/record";
import { isBodyNode } from "./body";
import { BODY_NODE_NAME } from "../../../constants/body";
import { getParentNodePosOfType } from "../node";
import { getPageAfterPos, getPageBeforePos } from "../page/pagePosition";
import { NullableNodePos } from "../../../types/node";
import { getPageRegionNodeAndPos } from "../../pageRegion/getAttributes";

/**
 * Get the body node (parent of the current node) position.
 * @param doc - The document node.
 * @param pos - The resolved position in the document or the absolute position of the node.
 * @returns {number} The position of the body node.
 */
export const getThisBodyNodePosition = (doc: PMNode, pos: ResolvedPos | number): number => {
    return getParentNodePosOfType(doc, pos, BODY_NODE_NAME).pos;
};

/**
 * Get the body node position and the body node itself.
 *
 * @param doc - The document node.
 * @param pos - The resolved position in the document or the absolute position of the node.
 * @returns {bodyPos: number, bodyNode: Node} The position and the node of the body.
 */
export const getBodyNodeAndPosition = (doc: PMNode, pos: ResolvedPos | number): { bodyPos: number; bodyNode: Nullable<PMNode> } => {
    if (typeof pos === "number") {
        return getBodyNodeAndPosition(doc, doc.resolve(pos));
    }

    const bodyPos = getThisBodyNodePosition(doc, pos);
    const bodyNode = doc.nodeAt(bodyPos);
    if (!isBodyNode(bodyNode)) {
        console.warn("No body node found");
        return { bodyPos: -1, bodyNode };
    }

    return { bodyPos, bodyNode };
};

/**
 * Get the start of the body position.
 *
 * @param doc - The document node.
 * @param pos - The resolved position in the document or the absolute position of the node.
 * @returns {number} The start position of the body.
 */
export const getStartOfBodyPosition = (doc: PMNode, pos: ResolvedPos | number): number => {
    if (typeof pos === "number") {
        return getStartOfBodyPosition(doc, doc.resolve(pos));
    }

    const { bodyPos } = getBodyNodeAndPosition(doc, pos);

    return bodyPos;
};

/**
 * Get the end of the body position.
 *
 * @param doc - The document node.
 * @param pos - The resolved position in the document or the absolute position of the node.
 * @returns {number} The end position of the body.
 */
export const getEndOfBodyPosition = (doc: PMNode, pos: ResolvedPos | number): number => {
    if (typeof pos === "number") {
        return getEndOfBodyPosition(doc, doc.resolve(pos));
    }

    const { bodyPos, bodyNode } = getBodyNodeAndPosition(doc, pos);
    if (!bodyNode) {
        return bodyPos;
    }

    return bodyPos + bodyNode.content.size;
};

/**
 * Gets the previous page's body and positiom, if any, after the given position.
 * @param doc - The current document.
 * @param pos - Any position within the current page's body
 * @returns {NullableNodePos} The previous page's body and position, if any.
 */
export const getBodyBeforePos = (doc: PMNode, pos: ResolvedPos | number): NullableNodePos => {
    const previousPage = getPageBeforePos(doc, pos);
    if (!previousPage.node) {
        return previousPage;
    }

    const { node: previousPageNode, pos: previousPagePos } = previousPage;
    return getPageRegionNodeAndPos(previousPagePos, previousPageNode, BODY_NODE_NAME);
};

/**
 * Gets the next page's body and positiom, if any, after the given position.
 * @param doc - The current document.
 * @param pos - Any position within the current page's body
 * @returns {NullableNodePos} The next page's body and position, if any.
 */
export const getBodyAfterPos = (doc: PMNode, pos: ResolvedPos | number): NullableNodePos => {
    const nextPage = getPageAfterPos(doc, pos);
    if (!nextPage.node) {
        return nextPage;
    }

    const { node: nextPageNode, pos: nextPagePos } = nextPage;
    return getPageRegionNodeAndPos(nextPagePos, nextPageNode, BODY_NODE_NAME);
};
