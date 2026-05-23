import { resource, atom } from '@cn-ui/reactive';
import { fetchEventSource } from '@microsoft/fetch-event-source';

export const useHotCDN = () => {
    const hotSubCDN = atom<{ key: string[]; value: number }[]>([]);
    resource(() => {
        return fetchEventSource(
            'https://cache-api.konghayao.deno.net?url=https://cn-font.claude-code-best.win/v1/deno-kv?get=["records","hit_cdn"]',
            {
                onmessage(e) {
                    hotSubCDN((i) => [...i, JSON.parse(e.data)]);
                },

                onerror(err) {
                    throw err;
                },
            }
        );
    });
    return hotSubCDN;
};
