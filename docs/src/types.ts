export type FontDetail = {
    name: string;
    css: {
        url: string;
        fontFamily: string;
        fontWeight?: "bolder" | "bold" | "normal";
    }[];
    license: {
        link: string;
    };
};
