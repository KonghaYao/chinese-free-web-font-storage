import type { FontReporter } from '@konghayao/cn-font-split';
import { __CDN__ } from '../global';
const cache = new Map<string, Promise<FontReporter>>();
export const getFontReporter = (font: string, fileName: string) => {
    const tag = `${font}_${fileName}`;
    if (cache.has(tag)) {
        return cache.get(tag)!;
    } else {
        const item = __CDN__ + `/packages/${font}/dist/${fileName}/reporter.json`;
        const p = fetch(item).then<FontReporter>((res) => res.json());
        cache.set(tag, p);
        return p;
    }
};
