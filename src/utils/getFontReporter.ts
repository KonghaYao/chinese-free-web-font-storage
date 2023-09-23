import type { FontReporter } from '@konghayao/cn-font-split';
const cache = new Map<string, Promise<FontReporter>>();
export const getFontReporter = (font: string, fileName: string) => {
    const tag = `${font}_${fileName}`;
    if (cache.has(tag)) {
        return cache.get(tag)!;
    } else {
        const item = `https://ik.imagekit.io/chinesefonts1/packages/${font}/dist/${fileName}/reporter.json`
        const p = fetch(item)
            .then<FontReporter>((res) => res.json())
        cache.set(tag, p);
        return p
    }
};
