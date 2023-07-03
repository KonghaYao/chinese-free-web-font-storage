import { For, Show, createResource, createSignal } from 'solid-js';
import {
    fontSplit,
    Assets,
} from 'https://cdn.jsdelivr.net/npm/@konghayao/cn-font-split@4.3.3/dist/browser/index.js';
import { DragDropButton } from '../DragButton';
import { resource } from '@cn-ui/reactive';
import prettyBytes from 'pretty-bytes';
const root = 'https://cdn.jsdelivr.net/npm/@konghayao/cn-font-split@4.3.3';
Assets.redefine({
    'hb-subset.wasm': root + '/dist/browser/hb-subset.wasm',
    'cn_char_rank.dat': root + '/dist/browser/cn_char_rank.dat',
    'unicodes_contours.dat': root + '/dist/browser/unicodes_contours.dat',
});
export const OnlineSplit = () => {
    const [file, setFile] = createSignal<File | null>(null);
    const [logMessage, setLog] = createSignal<string[]>([]);
    const [resultList, result] = createSignal<{ name: string; buffer: Uint8Array }[]>([]);
    const startSplit = resource<void>(
        async () => {
            if (!file()) return;

            return fontSplit({
                destFold: '',
                FontPath: new Uint8Array(await file()!.arrayBuffer()),
                targetType: 'woff2',
                // subsets: JSON.parse(await fs.readFile("./subsets/misans.json", "utf-8")),
                previewImage: {},
                threads: {},
                log(...args) {
                    setLog((i) => [...i, args.join(' ')]);
                },
                async outputFile(path, file) {
                    const buffer =
                        file instanceof Uint8Array
                            ? file
                            : new Uint8Array(await new Blob([file]).arrayBuffer());
                    result((i) => [...i, { name: path, buffer }]);
                },
            });
        },
        { immediately: false }
    );
    return (
        <section class="mx-auto my-8 grid aspect-video w-[80vw] grid-cols-2 gap-4 rounded-xl bg-white p-4">
            <div class="">
                <Show
                    when={file()}
                    fallback={
                        <DragDropButton
                            accept=".ttf,.otf"
                            onGetFile={(file) => setFile(() => file)}
                        ></DragDropButton>
                    }
                >
                    <div class="flex h-full flex-col items-center justify-center gap-4">
                        <div>{file()!.name}</div>
                        <Show
                            when={startSplit.isReady()}
                            fallback={<div class="text-red-600 ">正在加载动画中，请稍等</div>}
                        >
                            <button onclick={() => startSplit.refetch()}>
                                点击开始进行字体分包
                            </button>
                        </Show>
                    </div>
                </Show>
            </div>

            <section class="flex flex-col gap-4">
                <header class="text-xl">Logger 日志</header>
                <ul class="h-full max-h-36 select-text overflow-scroll rounded-xl bg-neutral-100 p-4 text-xs ">
                    <For each={logMessage()}>
                        {(item) => {
                            return <li>{item}</li>;
                        }}
                    </For>
                </ul>
                <header class="text-xl">
                    Output 输出文件 |{resultList().length} |
                    {prettyBytes(resultList().reduce((col, i) => i.buffer.byteLength + col, 0))}
                </header>
                <ul class="h-full max-h-36 select-text overflow-scroll rounded-xl bg-neutral-100 p-4 text-sm ">
                    <For each={resultList()}>
                        {(item) => {
                            return (
                                <li>
                                    {prettyBytes(item.buffer.byteLength)}|{item.name}{' '}
                                </li>
                            );
                        }}
                    </For>
                </ul>
            </section>
        </section>
    );
};
