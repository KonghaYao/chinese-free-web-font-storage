import { For } from 'solid-js';
import { selectDefPreviewText } from './defPreviewLanguages';
import type { FontMetaData } from './useGoogleFontData';
import copy from 'copy-to-clipboard';
export const GoogleFontDetailed = (props: { packageName: string; meta: FontMetaData }) => {
    const packageName = props.packageName;
    const FontStore = props.meta;
    // const { packageName } = useParams();
    // const [FontStore] = createResource<FontMetaData>(() => getMetaData(packageName));
    const transformFontData = (
        item: Record<string, Object>,
        lastName: string[] = []
    ): string[][] => {
        return Object.entries(item).flatMap(([name, value]) => {
            if (name === 'url') {
                return [lastName];
            } else {
                return transformFontData(value as Record<string, Object>, [...lastName, name]);
            }
        });
    };
    return (
        <div class="m-auto flex h-screen w-full max-w-2xl flex-col gap-2 divide-y divide-gray-300 overflow-auto p-4 ">
            <header class="py-4 text-center text-2xl">{FontStore.id}</header>
            <a
                href={`https://npm.im/@fontsource/${FontStore.id}`}
                class="flex justify-between px-2 pt-2"
                target="_blank"
            >
                <div>NPM 仓库</div>
                <div>{`@fontsource/${FontStore.id}`}</div>
            </a>
            <a
                href={`https://cdn.jsdelivr.net/npm/@fontsource/${FontStore.id}/`}
                class="flex justify-between px-2 pt-2"
                target="_blank"
            >
                <div> 仓库文件夹</div>
                <div>{`@fontsource/${FontStore.id}`}</div>
            </a>
            <nav class="mt-2 flex h-full flex-col overflow-auto pt-2">
                <header class="text-2xl text-orange-500">字体列表</header>

                <div class=" flex-1 overflow-auto  py-4">
                    <link
                        rel="stylesheet"
                        href={`https://cdn.jsdelivr.net/npm/@fontsource/${FontStore.id}/index.css`}
                    />
                    <nav class="flex flex-col gap-2  divide-y divide-violet-300">
                        <For
                            each={transformFontData(FontStore.variants)}
                            fallback={<div>加载数据中。。。</div>}
                        >
                            {(item) => {
                                return (
                                    <div
                                        class="pt-2"
                                        style={{
                                            'font-family': FontStore.family,
                                            'font-weight': item[0],
                                            'font-style': item[1],
                                        }}
                                    >
                                        <div class="flex-none text-xl">
                                            {item.join(' - ')}

                                            <span
                                                class="float-right  mr-4 cursor-pointer rounded bg-gray-200 py-2 px-4 text-sm transition-colors duration-300 hover:bg-lime-200"
                                                onclick={() => {
                                                    copy(
                                                        `https://cdn.jsdelivr.net/npm/@fontsource/${FontStore.id}/index.css`
                                                    );
                                                }}
                                            >
                                                复制 CSS URL
                                            </span>
                                        </div>
                                        <div class="py-2 text-lg text-gray-400">
                                            {selectDefPreviewText(FontStore.id, item[2])}
                                        </div>
                                    </div>
                                );
                            }}
                        </For>
                    </nav>
                </div>
            </nav>
            <a href="/google/search">
                <div class="w-full rounded-2xl bg-sky-400 py-2 text-center text-xl text-white">
                    返回搜索页面
                </div>
            </a>
        </div>
    );
};
