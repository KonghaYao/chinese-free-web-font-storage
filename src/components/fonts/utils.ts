export const getVersions = async (packageName: string) => {
    const { versions: V } = await fetch(
        `https://registry.npmmirror.com/@chinese-fonts/${packageName}`
    ).then((res) => res.json());
    return Object.keys(V);
};
export const getFontList = async (packageName: string, version: string): Promise<string[]> => {
    return fetch(
        `https://cdn.jsdelivr.net/npm/@chinese-fonts/${packageName}@${version}/dist/index.json`
    ).then((res) => res.json());
};
export interface FontReporter {
    config: { FontPath: string; destFold: string; chunkSize: number };
    data: { name: string; size: number; chars: string }[];
    message: {
        designer: string;
        fontFamily: string;
        fontSubFamily: string;
        fullName: string;
        manufacturer: string;
        postScriptName: string;
        tradeMark: string;
        uniqueSubFamily: string;
        urlOfFontDesigner: string;
        urlOfFontVendor: string;
        version: string;
    };
    record: { name: string; start: number; end: number }[];
}
