import { atom, reflect } from '@cn-ui/use';
import { Navigate, useParams } from '@solidjs/router';
import { batch, Component, createEffect, createResource, For, Match, Show, Switch } from 'solid-js';
import { version } from 'xlsx';
import { useEasyFont } from '../App';
import { setFontStore, useFontWatcher, FontStore } from './FontStore';
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
        FontStore.FontReporter &&
            replaceFont(
                FontStore.FontSubFolder + `/result.css`,
                `"${FontStore.FontReporter.message.fontFamily}"`,
                FontStore.FontReporter.message.fontSubFamily.toLowerCase()
            );
    });
    return (
        <div class="flex h-screen w-screen flex-col">
            <main class="my-4 flex flex-col">
                <header class="text-2xl">{FontStore.fontName}</header>
            </main>

            <nav class="flex flex-col border-t border-gray-300">
                <Show when={FontStore.FontReporter} fallback={<div>加载字体报告中。。。</div>}>
                    <Coverage></Coverage>
                </Show>
            </nav>
        </div>
    );
};

const Coverage = () => {
    const range = [
        ['基本汉字', 0x4e00, 0x9fa5],
        ['基本汉字补充', 0x9fa6, 0x9fff],
        ['扩展A', 0x3400, 0x4dbf],
        ['扩展B', 0x20000, 0x2a6df],
        ['扩展C', 0x2a700, 0x2b738],
        ['扩展D', 0x2b740, 0x2b81d],
        ['扩展E', 0x2b820, 0x2cea1],
        ['扩展F', 0x2ceb0, 0x2ebe0],
        ['扩展G', 0x30000, 0x3134a],
        ['康熙部首', 0x2f00, 0x2fd5],
        ['部首扩展', 0x2e80, 0x2ef3],
        ['兼容汉字', 0xf900, 0xfad9],
        ['兼容扩展', 0x2f800, 0x2fa1d],
        ['PUA(GBK)部件', 0xe815, 0xe86f],
        ['部件扩展', 0xe400, 0xe5e8],
        ['PUA增补', 0xe600, 0xe6cf],
        ['汉字笔画', 0x31c0, 0x31e3],
        ['汉字结构', 0x2ff0, 0x2ffb],
        ['汉语注音', 0x3105, 0x312f],
        ['注音扩展', 0x31a0, 0x31ba],
    ] as [string, number, number][];
    const total = FontStore.FontReporter.data.reduce((col, cur) => {
        return col + cur.chars;
    }, '');
    const result = range.map(([name, min, max]) => {
        let exist: string[] = [];
        let voids: string[] = [];
        for (let i = min; i <= max; i++) {
            const char = String.fromCharCode(i);
            const isExist = total.includes(char);
            if (isExist) {
                exist.push(char);
            } else {
                voids.push(char);
            }
        }
        return { name, exist, voids };
    });

    const showDetails = atom<string | false>(false);
    const matchDetails = reflect(
        () => showDetails() && result.find((i) => i.name === showDetails())
    );
    return (
        <main class="flex flex-col  text-center">
            <header class="p-4 text-center text-xl">中文完整度检测</header>
            <Switch>
                <Match when={!showDetails()}>
                    <nav class="py-2">点击查看详情</nav>
                    <div class="m-auto grid max-w-2xl grid-cols-6 gap-4 text-center">
                        <For each={result}>
                            {({ name, exist, voids }) => {
                                const coverage =
                                    ((exist.length * 100) / (exist.length + voids.length)).toFixed(
                                        2
                                    ) + '%';
                                return (
                                    <>
                                        <span>{name}</span>
                                        <span
                                            class="relative col-span-2  cursor-pointer overflow-hidden rounded-3xl bg-neutral-300 px-2 text-center"
                                            onclick={() => showDetails(name)}
                                        >
                                            <div
                                                class="absolute top-0 left-0  h-full  bg-lime-400"
                                                style={{
                                                    width: coverage,
                                                }}
                                            ></div>
                                            <div class="relative z-10 block text-left">
                                                包括 <b>{exist.length}</b>，缺失
                                                <b>{voids.length}</b>
                                                <span class="float-right">{coverage}</span>
                                            </div>
                                        </span>
                                    </>
                                );
                            }}
                        </For>
                    </div>
                </Match>
                <Match when={matchDetails()}>
                    <div class="flex flex-col overflow-hidden">
                        <div class="grid  h-1/2  grid-cols-2">
                            <main class="flex h-full flex-1 flex-col overflow-hidden">
                                <div class="py-2 text-2xl">
                                    覆盖字词 {matchDetails().exist.length}
                                </div>
                                <div class="mx-16 grid grid-cols-6  gap-2 overflow-y-auto rounded-md  bg-gray-300 p-8 font-sans">
                                    <For each={matchDetails().exist}>
                                        {(item) => {
                                            return <SingChar item={item}></SingChar>;
                                        }}
                                    </For>
                                </div>
                            </main>
                            <main class="flex h-full flex-1 flex-col overflow-hidden">
                                <div class="py-2 text-2xl">
                                    未覆盖字词 {matchDetails().voids.length}
                                </div>
                                <div class="mx-16 grid grid-cols-6  gap-2 overflow-y-auto rounded-md  bg-gray-300 p-8 font-sans">
                                    <For each={matchDetails().voids}>
                                        {(item) => {
                                            return <SingChar item={item}></SingChar>;
                                        }}
                                    </For>
                                </div>
                            </main>
                        </div>
                        <div
                            class="mx-auto my-2 w-1/4 rounded-md bg-red-600 p-2 text-lg text-white"
                            onclick={() => {
                                showDetails(false);
                            }}
                        >
                            返回
                        </div>
                    </div>
                </Match>
            </Switch>
        </main>
    );
};
import { VirtualContainer } from '@minht11/solid-virtual-container';
const CharShower = () => {
    return (
        <VirtualContainer
            items={createArray(30)}
            scrollTarget={targetHorizontal}
            itemSize={{ width: 50 }}
            direction="horizontal"
        >
            {ListItem}
        </VirtualContainer>
    );
};
const SingChar: Component<{ item: string }> = (props) => {
    return (
        <div
            class="flex flex-col justify-center "
            style={{
                'content-visibility': 'auto',
            }}
        >
            <span class="text-lg">{props.item}</span>
            <span class="font-sans text-xs font-thin">
                U+{props.item.charCodeAt(0).toString(16)}
            </span>
        </div>
    );
};
