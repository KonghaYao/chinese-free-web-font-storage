import { reflect } from '@cn-ui/use';
import { For } from 'solid-js';
import { FontStore } from '../FontStore';

export const FontInformation = () => {
    const entries = reflect(() => Object.entries(FontStore.FontReporter.message));
    return (
        <div class="p-4">
            <For each={entries()}>
                {([key, val]) => {
                    return (
                        <nav class="flex justify-between">
                            <nav class="text-sky-600">{key}</nav>
                            <nav class="select-text">{val}</nav>
                        </nav>
                    );
                }}
            </For>

            <div class="flex ">
                <a
                    class="rounded-md bg-neutral-200 px-2 text-green-600"
                    href={'https://www.maoken.com/?s=' + FontStore.fontName.split('-')[0]}
                    target="_black"
                >
                    字体授权查询
                </a>
            </div>
        </div>
    );
};
