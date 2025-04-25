import { Content } from "@tiptap/react";
export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};

export type DocumentData = {
    id:string,
    title: string,
    author: any,
    keywords?: string,
    abstract?: string
}


export interface DocumentProps extends PageProps {
    content: {
        contents: any,
        main: {
            number: number,
            text: string
        }, name: string
    },
    chapter: string,
    document: DocumentData
}

export type Image = {
    name:string,
    size:number,
    id:number

}

export interface ImagesProps extends PageProps{
    images:Image[],
    used:number,
    limit:number
}



interface DocumentPageProps extends PageProps {
        document: DocumentData | false

}
