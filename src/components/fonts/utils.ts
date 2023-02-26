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
