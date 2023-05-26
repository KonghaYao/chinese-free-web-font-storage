import { atom, reflect } from '@cn-ui/use';
import { For, Match, Switch, useContext } from 'solid-js';
import { CharShower } from '../component/CharShower';
import { DetailedContext } from '../DetailContext';

export const Coverage = () => {
    const { reporter } = useContext(DetailedContext)!;
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
        ['PUA(GBK)', 0xe815, 0xe86f],
        ['部件扩展', 0xe400, 0xe5e8],
        ['PUA增补', 0xe600, 0xe6cf],
        ['汉字笔画', 0x31c0, 0x31e3],
        ['汉字结构', 0x2ff0, 0x2ffb],
        ['汉语注音', 0x3105, 0x312f],
        ['注音扩展', 0x31a0, 0x31ba],
    ] as [string, number, number][];
    const total = reporter.data.reduce((col, cur) => {
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
    const matchDetails = reflect(() =>
        showDetails() ? result.find((i) => i.name === showDetails()) : undefined
    );
    return (
        <main class="flex flex-col  p-4 text-center">
            <header class="p-4 text-center text-xl">中文完整度检测</header>
            <Switch>
                <Match when={!showDetails()}>
                    <nav class="py-1 text-center text-sm text-gray-600">点击进度条查看详情</nav>
                    <div class="m-auto grid max-h-[80vh] grid-cols-3 gap-4 overflow-auto  p-2 text-center sm:grid-cols-6 lg:grid-cols-12">
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
                                            class="relative col-span-2   cursor-pointer overflow-hidden rounded-3xl bg-neutral-200 px-2 text-center"
                                            onclick={() => showDetails(name)}
                                        >
                                            <div
                                                class="absolute left-0 top-0  h-full  bg-lime-200"
                                                style={{
                                                    width: coverage,
                                                }}
                                            ></div>
                                            <div class="relative z-10 block whitespace-nowrap text-left">
                                                <b class="text-green-600">+ {exist.length}</b>
                                                <span> </span>
                                                <b class="text-red-600">-{voids.length}</b>
                                                <span class="float-right">{coverage}</span>
                                            </div>
                                        </span>
                                    </>
                                );
                            }}
                        </For>
                    </div>
                </Match>
                {/* 完整度检测器 */}
                <Match when={matchDetails()}>
                    <div class="flex flex-col overflow-hidden">
                        <div class="text-center text-sm text-gray-600">
                            若没有出现相应的字词，那么请稍等，加载中。
                        </div>
                        <div class="grid grid-cols-1  md:grid-cols-2">
                            <main class="flex h-full flex-1 flex-col overflow-hidden">
                                <div class="py-2 text-2xl">
                                    覆盖字词 {matchDetails()!.exist.length}
                                </div>
                                <CharShower class="" list={matchDetails()!.exist}></CharShower>
                            </main>
                            <main class="flex h-full flex-1 flex-col overflow-hidden">
                                <div class="py-2 text-2xl">
                                    未覆盖字词 {matchDetails()!.voids.length}
                                </div>

                                <CharShower
                                    class="font-sans"
                                    list={matchDetails()!.voids}
                                ></CharShower>
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
