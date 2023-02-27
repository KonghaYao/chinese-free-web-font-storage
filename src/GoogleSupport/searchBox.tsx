import algoliasearch from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';
import { searchBox, infiniteHits } from 'instantsearch.js/es/widgets';
import 'instantsearch.css/themes/satellite-min.css';
import { onCleanup, onMount } from 'solid-js';
import { PreviewGoogleFont } from './Google';
import { render } from 'solid-js/web';
const searchClient = algoliasearch('WNFN3NF9AT', '6dc69558ce4d0f209113294678d7d5bf');
const search = instantsearch({
    indexName: 'prod_FONTS',
    searchClient,
});

export const AlgoliaSearchBox = () => {
    let Container: HTMLDivElement;
    let Hits: HTMLDivElement;
    let RefinementList: HTMLDivElement;
    const createEl = (item: any, dom: HTMLDivElement) =>
        render(() => <PreviewGoogleFont {...item}></PreviewGoogleFont>, dom);
    const cacheItems = new Map<string, Function>();
    onCleanup(() => {
        for (let i of cacheItems.values()) {
            i();
        }
    });
    onMount(() => {
        search.addWidgets([
            searchBox({
                placeholder: '请输入英文字体名称',
                container: Container,
            }),
            // refinementList({
            //     container: RefinementList,
            //     attribute: 'category',
            //     operator: 'and',
            //     templates: {
            //         item(item, { html }) {
            //             const { url, label, count, isRefined } = item;

            //             return html`
            //                 <a href="${url}" style="${isRefined ? 'font-weight: bold' : ''}">
            //                     <span>${label} (${count})</span>
            //                 </a>
            //             `;
            //         },
            //     },
            // }),

            infiniteHits({
                container: Hits,
                templates: {
                    empty: '无结果',
                    item(item, { html }) {
                        return html`
                            <a href="${`/google/${item.fontId}`}">
                                <div
                                    class="flex w-full cursor-pointer flex-col"
                                    ref=${(dom: HTMLDivElement) => {
                                        if (dom) {
                                            // 为了避免不同的垃圾回收导致的性能下降
                                            (cacheItems.get(item.objectID) || (() => {}))();
                                            const c = createEl(item, dom);
                                            cacheItems.set(item.objectID, c);
                                        }
                                    }}
                                ></div>
                            </a>
                        `;
                    },
                },
            }),
        ]);

        !search.started && search.start();
    });
    return (
        <div class="flex h-screen w-screen flex-col gap-2  overflow-hidden rounded-lg px-8 pt-8 shadow-md">
            <header class="text-center text-2xl">Google Font 搜索</header>
            <div ref={Container!}></div>
            <div ref={RefinementList!}></div>
            <div ref={Hits!} class="h-full flex-1 overflow-auto"></div>
        </div>
    );
};
