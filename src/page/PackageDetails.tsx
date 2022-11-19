import { A, Link, useParams } from '@solidjs/router';
import { batch, For, Show } from 'solid-js';
import { FontStore, initFontStore, setFontStore } from './FontStore';

export const PackageDetails = () => {
    const { packageName } = useParams();
    batch(() => {
        setFontStore('packageName', packageName);
        setFontStore('selectedVersion', '');
    });
    initFontStore().then(async (api) => {
        await api.loadFontList();
        await api.loadSingleFont();
        await api.ChangeFont();
    });

    return (
        <div class="m-auto flex h-screen w-full max-w-2xl flex-col gap-2 divide-y divide-gray-300 overflow-auto p-4 ">
            <Show when={!FontStore.loading} fallback={<div> 加载数据中，请稍等</div>}>
                <header class="py-4 text-center text-2xl">
                    {FontStore.projectIndex?.packages?.[packageName]}
                </header>

                <div class="pt-2 text-center text-xs text-gray-400">字体加载需要时间，请稍等。</div>
                <div class="flex justify-between pt-2 text-2xl ">
                    <div>仓库代码</div>
                    <div>{packageName}</div>
                </div>
                <div class="flex justify-between pt-2   text-2xl ">
                    <div>版本号</div>
                    <select
                        class="rounded-lg"
                        value={FontStore.selectedVersion}
                        onchange={(e) => setFontStore('selectedVersion', (e.target as any).value)}
                    >
                        <For each={FontStore.versions}>
                            {(item) => <option value={item}>{item}</option>}
                        </For>
                    </select>
                </div>
                <nav class="mt-2 flex h-full flex-col overflow-auto pt-2">
                    <header class="text-2xl text-orange-500">字体列表</header>
                    <div class=" flex-1 overflow-auto  py-4">
                        <nav class="flex flex-col gap-2  ">
                            <For each={FontStore.fontList} fallback={<div>加载数据中。。。</div>}>
                                {(item) => {
                                    return (
                                        <Link href={`/fonts/${packageName}/` + item}>
                                            <div class="flex-none text-xl">
                                                {item}
                                                <span class="float-right  mr-4 cursor-pointer rounded bg-gray-200 py-2 px-4 text-sm transition-colors duration-300 hover:bg-lime-200">
                                                    跳转
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                }}
                            </For>
                        </nav>
                    </div>
                </nav>
                <A href="/">
                    <div class="w-full rounded-2xl bg-sky-400 py-2 text-center text-xl text-white">
                        返回主页
                    </div>
                </A>
            </Show>
        </div>
    );
};
