export type CssDetail = {
    url: string;
    fontFamily: string;
    fontWeight?: "bolder" | "bold" | "normal";
};
export type FontDetail = {
    name: string;
    css: CssDetail[];
    license: {
        link: string;
    };
};
