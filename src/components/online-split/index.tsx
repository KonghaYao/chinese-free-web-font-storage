import { For, Show, createSignal } from 'solid-js';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { DragDropButton } from '../DragButton';
import { resource } from '@cn-ui/reactive';
import prettyBytes from 'pretty-bytes';
// 转为异步加载，防止文件发生阻塞
const preload = import(
    'https://cdn.jsdelivr.net/npm/@konghayao/cn-font-split@4.4.0/dist/browser/index.js'
).then((res) => {
    const { fontSplit, Assets } = res;
    const root = 'https://cdn.jsdelivr.net/npm/@konghayao/cn-font-split@4.4.0';
    Assets.redefine({
        'hb-subset.wasm': root + '/dist/browser/hb-subset.wasm',
        'cn_char_rank.dat': root + '/dist/browser/cn_char_rank.dat',
        'unicodes_contours.dat': root + '/dist/browser/unicodes_contours.dat',
    });
    return fontSplit;
});

const getTestingFile = () => {
    return fetch(
        'https://cdn.jsdelivr.net/gh/KonghaYao/cn-font-split/packages/demo/public/SmileySans-Oblique.ttf'
    )
        .then((res) => res.blob())
        .then((res) => new File([res], 'SmileySans-Oblique.ttf'));
};

export const OnlineSplit = () => {
    const [file, setFile] = createSignal<File | null>(null);
    const [logMessage, setLog] = createSignal<string[]>([]);
    const [resultList, result] = createSignal<{ name: string; buffer: Uint8Array }[]>([]);

    /** 监控 zip 压缩 */
    const createZip = resource<void>(
        async () => {
            if (!file()) throw new Error('请添加文件');
            const zip = new JSZip();
            const name = file()!.name.replace(/\..*/, '');
            const folder = zip.folder(name)!;
            resultList().forEach((i) => {
                folder.file(i.name, i.buffer);
            });

            return zip.generateAsync({ type: 'blob' }).then(function (content: Blob) {
                saveAs(content, name + '.zip');
            });
        },
        { immediately: false }
    );
    const startSplit = resource<void>(
        async () => {
            if (!file()) return;
            const fontSplit = await preload;
            const url = URL.createObjectURL(file()!);
            return fontSplit({
                destFold: '',
                FontPath: url,
                targetType: 'woff2',
                // subsets: JSON.parse(await fs.readFile("./subsets/misans.json", "utf-8")),
                // previewImage: {},
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
            }).then((res) => {
                URL.revokeObjectURL(url);
            });
        },
        { immediately: false }
    );
    return (
        <section class="mx-auto my-8 grid aspect-video h-[80vh] grid-cols-2 gap-4 rounded-xl bg-white p-4">
            <div class="flex flex-col">
                <button
                    class="w-full hover:bg-neutral-300"
                    onclick={() => {
                        getTestingFile().then((f) => {
                            setFile(() => f);
                        });
                    }}
                >
                    尝试使用测试文件（下载时间稍长，请耐心等待）
                </button>
                <Show
                    when={file()}
                    fallback={
                        <DragDropButton
                            accept=".ttf,.otf"
                            onGetFile={(file) => setFile(() => file)}
                        >
                            <div class="pb-2 text-xl">在线字体分包器</div>
                        </DragDropButton>
                    }
                >
                    <div class="flex h-full flex-col items-center justify-center gap-4">
                        <div class="pb-2 text-xl">在线字体分包器</div>
                        <div>
                            {file()!.name} | {prettyBytes(file()!.size)}
                        </div>
                        <Show
                            when={startSplit.isReady()}
                            fallback={
                                <div class="text-red-600 ">
                                    正在处理文件中，请稍等，这个文本消失之后即为完成
                                </div>
                            }
                        >
                            <button
                                onclick={() => startSplit.refetch()}
                                class="rounded-lg bg-green-600 p-1 text-white"
                            >
                                点击开始进行字体分包
                            </button>
                        </Show>
                    </div>
                </Show>
                <div class="px-4 text-xs text-rose-600">
                    <a href="https://github.com/KonghaYao/cn-font-split">
                        在线分包由于特殊原因不支持某些字体特性，如需支持可使用代码分包➡️。
                    </a>
                </div>
            </div>

            <section class="flex h-full flex-col gap-4 overflow-hidden">
                <header class="text-xl">Logger 日志</header>
                <ul class="h-full max-h-[100%] select-text overflow-scroll rounded-xl bg-neutral-100 p-4 font-sans text-xs">
                    <For each={logMessage()}>
                        {(item) => {
                            return <li>{item}</li>;
                        }}
                    </For>
                </ul>
                <header class="text-xl">Output 输出文件</header>
                <ul class="h-full max-h-[100%]  select-text overflow-scroll rounded-xl bg-neutral-100 p-4 font-sans text-sm">
                    <For each={resultList()}>
                        {(item) => {
                            return (
                                <li>
                                    {prettyBytes(item.buffer.byteLength)} | {item.name}
                                </li>
                            );
                        }}
                    </For>
                </ul>
                <span class="flex justify-end gap-4 text-xs">
                    <span>{resultList().length}</span>
                    <span>
                        {prettyBytes(resultList().reduce((col, i) => i.buffer.byteLength + col, 0))}
                    </span>

                    <button
                        class="rounded-lg bg-green-600 p-1 text-center  text-white"
                        onclick={() => createZip.refetch()}
                    >
                        压缩下载 zip
                    </button>
                </span>
            </section>
        </section>
    );
};
