import React from "react";
import { type Mark, Node } from "@tiptap/pm/model";

export type TableOfContentProps = {
  pages: Node[]; /**Page node */
};

type Heading = {
  node: Node;   
  level: number;
  page: number;
};

export const TableOfContent: React.FC<TableOfContentProps> = ({ pages }) => {
  const toc: Heading[] = [];

  pages.forEach((p, i) => {
    if (p.child(0).type.name === "body") {
      const pageContents = p.child(0).content.content;
      pageContents.forEach((n) => {
        if (n.type.name === "heading") {
          toc.push({
            node: n,
            level: n.attrs.level,
            page: i + 1,
          });
        }
      });
    }
  });

  function renderHeadingNode(node: Node): React.ReactNode {
    if (node.isText) {
      return renderMarks(node.text || "", node.marks);
    }
    return node.content.content.map((child, i) => (
      <React.Fragment key={i}>{renderHeadingNode(child)}</React.Fragment>
    ));
  }

  function renderMarks(text: string, marks: readonly Mark[]): React.ReactNode {
    return marks.reduceRight<React.ReactNode>((acc, mark) => {
      switch (mark.type.name) {
        case "bold":
          return <strong>{acc}</strong>;
        case "italic":
          return <em>{acc}</em>;
        case "underline":
          return <u>{acc}</u>;
        case "link":
          return (
            <a href={mark.attrs.href} target="_blank" rel="noopener noreferrer">
              {acc}
            </a>
          );
        default:
          return acc;
      }
    }, text);
  }

  const renderTOC = (headings: Heading[], currentLevel = 1): React.ReactNode => {
    const items: React.ReactNode[] = [];
    let i = 0;

    while (i < headings.length) {
      const h = headings[i];
      if (h.level < currentLevel) {
        break;
      } else if (h.level === currentLevel) {
        let j = i + 1;
        while (j < headings.length && headings[j].level > currentLevel) {
          j++;
        }
        const subHeadings = headings.slice(i + 1, j);

        items.push(
          <li key={i}>
            {renderHeadingNode(h.node)} (page {h.page})
            {subHeadings.length > 0 && renderTOC(subHeadings, currentLevel + 1)}
          </li>
        );

        i = j;
      } else {
        i++;
      }
    }
    return <ul>{items}</ul>;
  };

  return <nav>{renderTOC(toc)}</nav>;
};
