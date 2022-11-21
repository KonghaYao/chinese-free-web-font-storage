import { atom, reflect } from '@cn-ui/use';
import { VirtualContainer, VirtualItemProps } from '@minht11/solid-virtual-container';
import { Component, createEffect, createResource, For, onMount, Show } from 'solid-js';
import { selectDefPreviewText } from './defPreviewLanguages';
import { subsets } from './subsets';
import { getFontList } from './useGoogleFontData';
import throttle from 'lodash-es/throttle';
export const GoogleFont = () => {
    const [fontList] = createResource(() => getFontList());
    const packageKey = atom('');
    let scrollTargetElement;
    const subset = atom('all');
    const showingList = reflect(() => {
        // const filter = subset();
        const reg = new RegExp(packageKey(), 'i');
        if (fontList()) {
            // if (filter === 'all') return fontList();
            return fontList().filter((i) => reg.test(i));
        } else {
            return [];
        }
    });
    onMount(() => {
        // import('./searchBox');
    });
    return (
        <div>
            <div class="flex ">
                <input
                    class=" mx-4 rounded-md p-2 font-medium outline-none ring ring-green-600"
                    placeholder="搜索字体项目"
                    value={packageKey()}
                    type="search"
                    name=""
                    oninput={throttle((e: any) => {
                        packageKey(e.target.value);
                    }, 300)}
                />
            </div>
            <div>
                <select value={subset()} onchange={(e: any) => subset(e.target.value)}>
                    <For each={subsets}>{([en, cn]) => <option value={en}>{cn}</option>}</For>
                </select>
            </div>
            <div
                class={'mx-4 flex h-[80vh]   overflow-auto rounded-md  bg-gray-300  p-8 '}
                ref={scrollTargetElement}
            >
                {showingList().length === 0 && <div>一个都没有</div>}
                <VirtualContainer
                    items={showingList() ?? []}
                    scrollTarget={scrollTargetElement}
                    itemSize={{ height: 150, width: 400 }}
                    overscan={1}
                    crossAxisCount={(measurements) => {
                        return Math.floor(
                            measurements.container.cross / measurements.itemSize.cross
                        );
                    }}
                >
                    {(item) => {
                        return <PreviewGoogleFont {...item} name={item.item}></PreviewGoogleFont>;
                    }}
                </VirtualContainer>
            </div>
        </div>
    );
};
import { getMetaData } from './useGoogleFontData';
const PreviewGoogleFont: Component<VirtualItemProps<string> & { name: string }> = (prop) => {
    const [meta, { refetch }] = createResource(() => getMetaData(prop.name));
    createEffect(() => {
        // 绑定 name 依赖
        prop.name;
        refetch();
    });
    return (
        <div style={prop.style} class="mx-auto">
            <Show when={meta()}>
                <div
                    style={{
                        'font-family': meta().family,
                        'font-weight': meta().weights[0],
                        'font-style': meta().styles[0],
                    }}
                    class="rounded-xl bg-gray-100 p-2"
                >
                    <header class="text-lg">{prop.name}</header>
                    <p>{selectDefPreviewText(meta().id, meta().subsets[0])}</p>
                    <link
                        rel="stylesheet"
                        href={`https://cdn.jsdelivr.net/npm/@fontsource/${meta().id}/index.css`}
                    />
                    <div class="flex flex-wrap gap-2">
                        <For each={meta().subsets}>
                            {(item) => {
                                return (
                                    <span class="flex-none rounded-md bg-green-600 px-2 text-white">
                                        {item}
                                    </span>
                                );
                            }}
                        </For>
                    </div>
                </div>
            </Show>
        </div>
    );
};
