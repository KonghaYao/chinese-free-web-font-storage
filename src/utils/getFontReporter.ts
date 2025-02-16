import { decodeReporter } from 'cn-font-split/dist/decodeReporter';
import { __CDN__ } from '../global';
const cache = new Map<string, Promise<any>>();
export const getFontReporter = (font: string, fileName: string) => {
    const tag = `${font}_${fileName}`;
    if (cache.has(tag)) {
        return cache.get(tag)!;
    } else {
        const item = __CDN__ + `/packages/${font}/dist/${fileName}/reporter.bin`;
        const p = fetch(item)
            .then((res) => res.arrayBuffer())
            .then((res) => {
                return decodeReporter(new Uint8Array(res)).toObject();
            })
            .then((res) => {
                /** @ts-ignore */
                res.message = {
                    windows: res.nameTable?.reduce(
                        (acc, cur) => {
                            if (cur.platform === 'Windows' && cur.name) {
                                /** @ts-ignore */
                                acc[cur.name] = cur.value;
                            }
                            return acc;
                        },
                        {} as Record<string, string>
                    ),
                };
                return res;
            })
            .catch((e) => {
                console.log(item);
                throw new Error(e);
            });
        cache.set(tag, p);
        return p;
    }
};
