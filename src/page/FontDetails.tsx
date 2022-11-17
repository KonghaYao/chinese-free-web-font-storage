import { atom } from '@cn-ui/use';
import { Navigate, useParams } from '@solidjs/router';
import {
    batch,
    createEffect,
    createResource,
    For,
    JSXElement,
    Match,
    Show,
    Switch,
} from 'solid-js';
import { useEasyFont } from '../App';
import { setFontStore, useFontWatcher, FontStore } from './FontStore';
import { Coverage } from './SubPanel/Coverage';
import { FontUsage } from './SubPanel/FontUsage';

export const FontDetails = () => {
    const { packageName, fontName } = useParams();
    batch(() => {
        setFontStore('packageName', packageName);
        setFontStore('fontName', fontName);
    });

    const { autoLoadSingleFont } = useFontWatcher();

    autoLoadSingleFont();
    const { replaceFont } = useEasyFont();
    createEffect(() => {
        // console.log(FontStore.FontSubFolder);
        FontStore.FontReporter &&
            replaceFont(
                FontStore.FontSubFolder + `result.css`,
                `"${FontStore.FontReporter.message.fontFamily}"`,
                FontStore.FontReporter.message.fontSubFamily.toLowerCase()
            );
    });

    const ShowingPanel = atom('');
    const PanelList = [
        { value: '', label: '隐藏' },
        { value: 'font-usage', label: '字体使用说明' },
        { value: 'coverage', label: '中文覆盖率' },
    ];
    return (
        <div class="flex h-screen w-screen flex-col">
            <main class="my-4 flex w-screen  flex-1 flex-col">
                <header class="text-2xl">{FontStore.fontName}</header>
            </main>

            <div class="flex justify-center gap-4 py-2">
                <For each={PanelList}>
                    {(item) => {
                        return (
                            <div
                                class="cursor-pointer rounded-lg bg-neutral-200 p-2 text-lg transition-colors duration-300"
                                classList={{
                                    ['bg-green-600 text-white']: ShowingPanel() === item.value,
                                }}
                                onclick={() => ShowingPanel(item.value)}
                            >
                                {item.label}
                            </div>
                        );
                    }}
                </For>
            </div>
            <nav class="flex flex-col border-t border-gray-300 p-2">
                <Show when={FontStore.FontReporter} fallback={<div>加载字体报告中。。。</div>}>
                    <Switch>
                        <Match when={ShowingPanel() === 'coverage'}>
                            <Coverage></Coverage>
                        </Match>
                        <Match when={ShowingPanel() === 'font-usage'}>
                            <FontUsage></FontUsage>
                        </Match>
                    </Switch>
                </Show>
            </nav>
        </div>
    );
};
