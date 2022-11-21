export type FontMetaData = {
    // https://fontsource.org/docs/api/font-id
    id: string;
    family: string;
    subsets: string[];
    weights: number[];
    styles: string[];
    unicodeRange: Record<string, string>;
    defSubset: string;
    variable: boolean;
    lastModified: string;
    category: string;
    version: string;
    type: string;
    variants: any;
    // '400': {
    //     normal: {
    //         latin: {
    //             url: {
    //                 woff2: 'https://cdn.jsdelivr.net/npm/@fontsource/abel/files/abel-latin-400-normal.woff2';
    //                 woff: 'https://cdn.jsdelivr.net/npm/@fontsource/abel/files/abel-latin-400-normal.woff';
    //                 ttf: 'https://api.fontsource.org/v1/fonts/abel/latin-400-normal.ttf';
    //             };
    //         };
    //     };
    // };
};

/* 获取所有字体的列表 */
export const getFontList = async () => {
    const datalist = await fetch('https://api.fontsource.org/fontlist', {
        cache: 'force-cache',
    }).then((res) => res.json());
    return Object.entries(datalist)
        .filter(([_, key]) => {
            return key === 'google';
        })
        .map((i) => i[0]);
};

/** 获取 css 文件的 URL */
export const getCSSURL = (name: string, fontWeight = 'index') => {
    return `https://cdn.jsdelivr.net/npm/@fontsource/${name}/${fontWeight}.css`;
};
/** 获取 Google 字体对应的 MetaData  */
export const getMetaData = async (name: string) => {
    const data: FontMetaData = await fetch(`https://api.fontsource.org/v1/fonts/${name}`, {
        cache: 'force-cache',
    }).then((res) => res.json());

    return data;
};
