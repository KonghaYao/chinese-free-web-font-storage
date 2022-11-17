import { atom } from '@cn-ui/use';
import { Navigate, useParams } from '@solidjs/router';
import { batch, createEffect, createResource, JSXElement, Match, Show, Switch } from 'solid-js';
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

    const ShowingPanel = atom('font-usage');
    return (
        <div class="flex h-screen w-screen flex-col">
            <main class="my-4 flex flex-col">
                <header class="text-2xl">{FontStore.fontName}</header>
            </main>

            <nav class="flex flex-col border-t border-gray-300">
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
