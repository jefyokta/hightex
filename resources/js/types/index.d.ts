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
