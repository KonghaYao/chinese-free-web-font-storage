import type { FontReporter } from '../components/fonts/utils';

const cache = new Map<string, FontReporter>();
export const getFontReporter = (font: string, fileName: string) => {
    const tag = `${font}_${fileName}`;
    if (cache.has(tag)) {
        return cache.get(tag)!;
    } else {
        return fetch(
            `https://ik.imagekit.io/chinesefonts/packages/${font}/dist/${fileName}/reporter.json`
        )
            .then<FontReporter>((res) => res.json())
            .then((res) => {
                cache.set(tag, res);
                return res;
            });
    }
};
