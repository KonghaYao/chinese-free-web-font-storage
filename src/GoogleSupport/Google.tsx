import { atom } from '@cn-ui/use';
import { Component, For, onCleanup, onMount, Show } from 'solid-js';

import { selectDefPreviewText } from './defPreviewLanguages';

export const GoogleFont = () => {
    return <AlgoliaSearchBox></AlgoliaSearchBox>;
};
import { AlgoliaSearchBox } from './searchBox';
export const PreviewGoogleFont: Component<any> = (prop) => {
    const show = atom(false);
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            show(entry.isIntersecting);
        });
    }, {});
    let root: HTMLDivElement;
    onMount(() => {
        observer.observe(root);
    });
    return (
        <div class="w-full" ref={root!}>
            <div
                style={{
                    'font-family': prop.fontName,
                    'font-weight': prop.weights[0],
                    'font-style': prop.styles[0],
                }}
                class="rounded-xl bg-gray-100 p-2 transition-transform duration-300  hover:-translate-y-2 hover:scale-105 "
            >
                <header class="text-lg">{prop.fontId}</header>
                <p>{selectDefPreviewText(prop.fontId, prop.subsets[0])}</p>

                <div class="flex justify-between">
                    <div class="flex flex-wrap gap-2">
                        <For each={prop.subsets}>
                            {(item: string) => {
                                return (
                                    <span class="flex-none rounded-md bg-green-600 px-2 text-white">
                                        {item}
                                    </span>
                                );
                            }}
                        </For>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <For each={prop.weights}>
                            {(item: string) => {
                                return (
                                    <span class="flex-none rounded-md bg-blue-600 px-2 text-xs text-white">
                                        {item}
                                    </span>
                                );
                            }}
                        </For>
                    </div>
                </div>
            </div>
            <Show when={show()}>
                <link
                    href={`https://cdn.jsdelivr.net/npm/@fontsource/${prop.fontId}/index.css`}
                    rel="stylesheet"
                ></link>
            </Show>
        </div>
    );
};
