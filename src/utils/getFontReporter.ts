import type { FontReporter } from '../components/fonts/FontReporter';
import { __CDN__ } from '../global';
const cache = new Map<string, FontReporter>();
export const getFontReporter = (font: string, fileName: string) => {
    const tag = `${font}_${fileName}`;
    if (cache.has(tag)) {
        return cache.get(tag)!;
    } else {
        return fetch(
            __CDN__ + `/packages/${font}/dist/${fileName}/reporter.json`
        )
            .then<FontReporter>((res) => res.json())
            .then((res) => {
                cache.set(tag, res);
                return res;
            });
    }
};
