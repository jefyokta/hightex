import { Node } from "@tiptap/pm/model";


export const TableOfContents: React.FC<{ nodes: readonly Node[] }> = ({ nodes }) => {

    const headings = nodes.filter(n => n.type.name == 'heading')
    return <div>{headings.map(h => <li><a href={`#${h.attrs.id}`}>{h.textContent}</a> </li>)}</div>

}
