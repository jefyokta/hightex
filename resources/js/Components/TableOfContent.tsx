import React from "react";
import { type Mark, Node } from "@tiptap/pm/model";
import { JSONContent } from "@tiptap/react";

export type TableOfContentProps = {
    pages: JsonNode[];
};

type JsonNode = JSONContent

type Heading = {
    node: JsonNode;
    level: number;
    page: number;
};

export const TableOfContent: React.FC<TableOfContentProps> = ({ pages }) => {
    const toc: Heading[] = [];


    const pagess = pages.filter(n => n.type == 'page')
    pagess.forEach((p, i) => {

        // console.log(p.content[0])
        if (p && p.content && p.content[0]?.type === "body") {
            const pageContents = p.content[0].content;
            pageContents?.forEach((n) => {
                if (n.type === "heading") {
                    toc.push({
                        node: n,
                        level: n?.attrs?.level,
                        page: i + 1,
                    });
                }
            });
        }
    });
    function renderHeadingNode(node: JsonNode): React.ReactNode {

        if (node.type == 'text') {
            return node.text;
        }
        return node.content?.map((child, i) => (
            <React.Fragment key={i}>{renderHeadingNode(child)}</React.Fragment>
        ));
    }

    function renderMarks(text: string, marks: JsonNode[]): React.ReactNode {
        return marks.map((mark) => {
            switch (mark.type) {
                case "bold":
                    return <strong>{text}</strong>;
                case "italic":
                    return <em>{text}</em>;
                case "underline":
                    return <u>{text}</u>;
                case "link":
                    return (
                        <a href={mark.attrs?.href} target="_blank" rel="noopener noreferrer">
                            {text}
                        </a>
                    );
                default:
                    return text;
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
                    <li key={i} className="list-decimal">
                        {renderHeadingNode(h.node)}.............. ({h.page})
                        {subHeadings.length > 0 && renderTOC(subHeadings, currentLevel + 1)}
                    </li>
                );

                i = j;
            } else {
                i++;
            }
        }
        return <ol>{items}</ol>;
    };

    return <nav>{renderTOC(toc)}</nav>;
};
