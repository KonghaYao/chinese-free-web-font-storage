import { atom } from '@cn-ui/use';
import { Component, createEffect, createResource, For, onCleanup, onMount, Show } from 'solid-js';
import { selectDefPreviewText } from './defPreviewLanguages';

export const GoogleFont = () => {
    return <AlgoliaSearchBox></AlgoliaSearchBox>;
};
import { AlgoliaSearchBox } from './searchBox';
export const PreviewGoogleFont: Component<any> = (prop) => {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                show(true);
            }
        });
    }, {});
    let root: HTMLDivElement;
    const show = atom(false);
    onMount(() => {
        observer.observe(root);
    });
    onCleanup(() => {
        console.log('被删除');
    });
    return (
        <div class="w-full" ref={root}>
            <div
                style={{
                    'font-family': prop.family,
                    'font-weight': prop.weights[0],
                    'font-style': prop.styles[0],
                }}
                class="rounded-xl bg-gray-100 p-2 transition-transform duration-300  hover:-translate-y-2 hover:scale-105 "
            >
                <header class="text-lg">{prop.fontId}</header>
                <p>{selectDefPreviewText(prop.fontId, prop.subsets[0])}</p>
                {show() && (
                    <link
                        rel="stylesheet"
                        href={`https://cdn.jsdelivr.net/npm/@fontsource/${prop.fontId}/index.css`}
                    />
                )}
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
        </div>
    );
};
