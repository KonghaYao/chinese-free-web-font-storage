import { decodeReporter } from 'cn-font-split/dist/decodeReporter';
import { __CDN__ } from '../global';
const cache = new Map<string, Promise<any>>();
export const getFontReporter = (font: string, fileName: string) => {
    const tag = `${font}_${fileName}`;
    if (cache.has(tag)) {
        return cache.get(tag)!;
    } else {
        const item = __CDN__ + `/packages/${font}/dist/${fileName}/reporter.bin`;
        const p = fetch(item, {
            headers: {
                referer: 'https://chinese-font.netlify.app/',
                referrer: 'https://chinese-font.netlify.app/',
                host: 'https://chinese-font.netlify.app/',
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch reporter: ${res.status} ${res.statusText}`);
                }
                return res.arrayBuffer();
            })
            .then((res) => {
                const data = new Uint8Array(res);
                if (data.length === 0) {
                    throw new Error('Reporter binary is empty');
                }
                return decodeReporter(data).toObject();
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
