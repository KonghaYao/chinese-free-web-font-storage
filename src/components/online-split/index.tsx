import { For, Show, createSignal } from 'solid-js';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { DragDropButton } from '../DragButton';
import { ArrayAtom, atom, resource } from '@cn-ui/reactive';
import prettyBytes from 'pretty-bytes';

const PluginVersion = atom('4.6.0');
// 转为异步加载，防止文件发生阻塞
const root = 'https://cdn.jsdelivr.net/npm/@konghayao/cn-font-split';
const preload = import(
    'https://cdn.jsdelivr.net/npm/@konghayao/cn-font-split/dist/browser/index.js'
)
    .then((res) => {
        const { fontSplit, Assets } = res;
        Assets.redefine({
            'hb-subset.wasm': root + '/dist/browser/hb-subset.wasm',
            'cn_char_rank.dat': root + '/dist/browser/cn_char_rank.dat',
            'unicodes_contours.dat': root + '/dist/browser/unicodes_contours.dat',
        });
        fetch('https://cdn.jsdelivr.net/npm/@konghayao/cn-font-split/dist/browser/index.js', {
            cache: 'force-cache',
        }).then((res) => {
            PluginVersion(res.headers.get('X-Jsd-Version')!);
        });
        return fontSplit;
    })
    .catch((e) => e as Error);

// 为给用户提供良好的体验，直接开始下载需要的依赖包
Promise.all([
    fetch(root + '/dist/browser/hb-subset.wasm', { priority: 'low' }),
    fetch(root + '/dist/browser/cn_char_rank.dat', { priority: 'low' }),
    fetch(root + '/dist/browser/unicodes_contours.dat', { priority: 'low' }),
]).then((res) => console.log('资源预加载完成'));

/** 加载测试文件 */
const getTestingFile = () => {
    return fetch(
        'https://cdn.jsdelivr.net/gh/KonghaYao/cn-font-split/packages/demo/public/SmileySans-Oblique.ttf'
    )
        .then((res) => res.blob())
        .then((res) => new File([res], 'SmileySans-Oblique.ttf'));
};

export const OnlineSplit = () => {
    const file = atom<File | null>(null);
    const logMessage = ArrayAtom<string[]>([]);
    const resultList = atom<{ name: string; buffer: Uint8Array }[]>([]);
    const fontSplitStatus = resource(async () => {
        const info = await preload;
        if (info instanceof Error) throw info;
        return info;
    });
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
            const fn = fontSplitStatus();
            if (!file()) throw new Error('请添加文件');
            if (!fn) throw new Error('请等待 cn-font-split 加载完成');
            const url = URL.createObjectURL(file()!);
            return fn({
                destFold: '',
                FontPath: url,
                targetType: 'woff2',
                previewImage: {},
                threads: {},
                log(...args) {
                    logMessage((i) => [...i, args.join(' ')]);
                },
                async outputFile(path, file) {
                    const buffer =
                        file instanceof Uint8Array
                            ? file
                            : new Uint8Array(await new Blob([file]).arrayBuffer());
                    resultList((i) => [...i, { name: path, buffer }]);
                },
            }).then((res) => URL.revokeObjectURL(url));
        },
        { immediately: false }
    );
    return (
        <section class="mx-auto my-8 grid aspect-video h-[80vh] grid-cols-2 gap-4 rounded-xl bg-white p-4">
            <div class="flex flex-col">
                <header class="flex items-center gap-8">
                    <a href="https://github.com/KonghaYao/cn-font-split">
                        <img
                            src="https://data.jsdelivr.com/v1/package/npm/@konghayao/cn-font-split/badge"
                            alt="JSDeliver Badge"
                        />
                    </a>
                    <button
                        class="w-full cursor-pointer transition-colors hover:bg-neutral-200"
                        onclick={() => {
                            getTestingFile().then((f) => {
                                file(() => f);
                            });
                        }}
                    >
                        尝试使用测试字体文件
                    </button>
                </header>
                <Show
                    when={file()}
                    fallback={
                        <DragDropButton accept=".ttf,.otf" onGetFile={(f) => file(() => f)}>
                            <div class="pb-2 text-xl">在线字体分包器 {PluginVersion()}</div>
                        </DragDropButton>
                    }
                >
                    <div class="flex h-full flex-col items-center justify-center gap-4">
                        <h1 class="pb-2 text-xl">在线字体分包器 {PluginVersion()}</h1>
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
                    <Show when={fontSplitStatus.isReady()}>
                        <a href="https://github.com/KonghaYao/cn-font-split">
                            在线分包由于特殊原因不支持某些特性，如需支持可使用代码分包➡️。
                        </a>
                    </Show>
                    <Show when={fontSplitStatus.error()}>
                        加载 cn-font-split 失败：{fontSplitStatus.error().message}
                        <br />
                        可能是您的浏览器版本过低，试试更新版本的浏览器吧
                    </Show>
                    <Show when={fontSplitStatus.loading()}>加载 cn-font-split 中</Show>
                </div>
            </div>

            <section class="flex h-full flex-col gap-4 overflow-hidden">
                <header class="flex justify-between ">
                    <span class="text-xl">Logger 日志</span>
                    <a href="https://github.com/KonghaYao/cn-font-split/issues" target="_blank">
                        反馈
                    </a>
                </header>
                <Show when={startSplit.error()}>
                    <div class="text-red-600 ">发生错误：{startSplit.error().message}</div>
                </Show>
                <ul class="h-full max-h-[100%] select-text overflow-scroll rounded-xl bg-neutral-100 p-4 font-sans text-xs">
                    <For each={logMessage()}>
                        {(item) => {
                            return <li innerHTML={ConsolePrint(item)}></li>;
                        }}
                    </For>
                </ul>
                <header class="text-xl">Output 输出文件</header>
                <div class="h-full max-h-[100%] select-text overflow-scroll rounded-xl bg-neutral-100 p-4 font-sans text-sm">
                    <div class="grid   grid-cols-8  ">
                        <For each={resultList()}>
                            {(item) => {
                                return (
                                    <>
                                        <span class="col-span-2">
                                            {prettyBytes(item.buffer.byteLength)}
                                        </span>
                                        <span class="col-span-6">{item.name}</span>
                                    </>
                                );
                            }}
                        </For>
                    </div>
                </div>
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

export const ConsolePrint = (item: string) => {
    return item
        .replace(
            /\[97m\[1m(.*?)\[22m\[39m\[0m\[0m/g,
            '<span  style="color: green;font-weight: bold;" >$1</span>'
        )
        .replace(
            /\[34m\[1m(.*?)\[22m\[39m\[0m\[0m/g,
            '<span style="color: blue;font-weight: bold;" >$1</span>'
        );
};
