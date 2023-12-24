import { For, Show, createEffect } from 'solid-js';
import { saveAs } from 'file-saver';
import { DragDropButton } from '../DragButton';
import {
    ArrayAtom,
    atom,
    resource,
    useEffectWithoutFirst,
    type ResourceAtom,
} from '@cn-ui/reactive';
import prettyBytes from 'pretty-bytes';
import { Notice } from '../../Notice';
import { RaceFetch } from './RaceFetch';

const PluginVersion = atom('');
// 转为异步加载，防止文件发生阻塞
let roots = [
    'https://cdn.jsdelivr.net/npm/@konghayao/cn-font-split',
    'https://jsdelivr.deno.dev/npm/@konghayao/cn-font-split',
];

const preload = () => {
    /** 24h 小时更新一次的链接，保证版本更新正确 */
    const scriptLink =
        roots[1] +
        (PluginVersion() ? '@' + PluginVersion() : '') +
        '/dist/browser/index.js?t=' +
        (Date.now() / (24 * 60 * 60 * 1000)).toFixed(0);
    return import(/* @vite-ignore */ scriptLink)
        .then((res) => {
            const { fontSplit, Assets } = res as Awaited<typeof import('@konghayao/cn-font-split')>;
            // 注册在线地址
            Assets.pathTransform = (innerPath: string) =>
                innerPath.replace('./', roots[0] + '/dist/browser/');
            // 获取版本号信息
            fetch(scriptLink, { cache: 'force-cache' }).then((res) => {
                PluginVersion(res.headers.get('X-Jsd-Version')!);
            });
            return fontSplit;
        })
        .catch((e) => {
            Notice.error(e as Error);
        });
};
// 为给用户提供良好的体验，直接开始下载需要的依赖包
Promise.all([
    RaceFetch('/dist/browser/hb-subset.wasm', { priority: 'low' }, roots),
    RaceFetch('/dist/browser/cn_char_rank.dat', { priority: 'low' }, roots),
    RaceFetch('/dist/browser/unicodes_contours.dat', { priority: 'low' }, roots),
    RaceFetch('/dist/browser/compress_binding.wasm', { priority: 'low' }, roots),
]).then((res) => console.log('资源预加载完成'));

/** 获取 cn-font-split 的版本号 */
const getVersions = () => {
    return fetch('https://data.jsdelivr.com/v1/package/npm/@konghayao/cn-font-split')
        .then((res) => res.json())
        .then((res) => res.versions.slice(0, 10) as string[]);
};

/** 加载测试文件 */
const getTestingFile = () => {
    return fetch(
        'https://jsdelivr.deno.dev/gh/KonghaYao/cn-font-split/packages/demo/public/SmileySans-Oblique.ttf'
    )
        .then((res) => res.blob())
        .then((res) => new File([res], 'SmileySans-Oblique.ttf'));
};

export const OnlineSplit = () => {
    const file = atom<File | null>(null);
    const logMessage = ArrayAtom<string[]>([]);
    const resultList = atom<{ name: string; buffer: Uint8Array }[]>([]);
    const versions = resource(getVersions, { initValue: [] });
    /** 监控 cn-font-split 的加载状态并给予提示 */
    const fontSplitStatus = resource(preload);

    createEffect(() => {
        fontSplitStatus() &&
            logMessage((i) => [...i, `cn-font-split ${PluginVersion()} 准备完毕 `]);
    });

    /** 监控 zip 压缩 */
    const createZip = resource(
        async () => {
            if (!file()) throw new Error('请添加文件');
            const { default: JSZip } = await import('jszip');
            const zip = new JSZip();
            const name = file()!.name.replace(/\..*/, '');
            const folder = zip.folder(name)!;
            resultList().forEach((i) => {
                folder.file(i.name, i.buffer);
            });

            return zip.generateAsync({ type: 'blob' }).then(function (content: Blob) {
                Notice.success('压缩文件下载中');
                saveAs(content, name + '.zip');
            });
        },
        { immediately: false }
    );
    /** 启动字体分包进程 */
    const startSplit = resource(
        async () => {
            const cnFontSplit = fontSplitStatus();
            if (!file()) throw new Error('请添加文件');
            if (!cnFontSplit) throw new Error('请等待 cn-font-split 加载完成');
            const url = URL.createObjectURL(file()!);
            logMessage([]);
            resultList([]);
            return cnFontSplit({
                destFold: '',
                FontPath: url,
                previewImage: {},
                log(...args) {
                    logMessage((i) => [...i, args.join(' ')]);
                },
                // 生产的文件转存另一个分包
                async outputFile(path, file) {
                    const buffer =
                        file instanceof Uint8Array
                            ? file
                            : new Uint8Array(await new Blob([file]).arrayBuffer());
                    resultList((i) => [...i, { name: path, buffer }]);
                },
            })
                .then((res) => URL.revokeObjectURL(url))
                .then((res) => {
                    Notice.success('全部打包任务完成');
                    return res;
                });
        },
        { immediately: false }
    );
    useResourceErrorWatch(createZip);
    useResourceErrorWatch(startSplit);
    return (
        <section class="mx-auto my-8 grid aspect-video h-[80vh] w-full max-w-[96rem] grid-cols-2 gap-4 overflow-hidden rounded-xl bg-white ">
            <div class="flex flex-col p-4">
                <header class="flex items-center gap-8">
                    <label class="flex-none">版本号</label>
                    <select
                        oninput={(e) => {
                            PluginVersion(e.target.value);
                            fontSplitStatus.refetch();
                            Notice.success('正在更换版本中，请稍等');
                        }}
                    >
                        {versions().map((version) => {
                            return <option value={version}>{version}</option>;
                        })}
                    </select>
                    <button
                        class="w-full cursor-pointer transition-colors hover:bg-neutral-200"
                        onclick={() => {
                            getTestingFile().then((f) => file(() => f));
                        }}
                    >
                        尝试使用测试字体文件
                    </button>
                </header>
                <Show
                    when={file()}
                    fallback={
                        <DragDropButton
                            class="text-gray-600"
                            accept=".ttf,.otf,.woff2"
                            onGetFile={(f) => {
                                file(() => f);
                                logMessage((i) => [...i, '请点击开始按钮']);
                            }}
                        >
                            <header class="pb-2 text-xl text-black">
                                在线字体分包器 <br></br>
                                <aside class="flex justify-center gap-4 py-4">
                                    <span class="rounded-md bg-green-600 px-2 text-sm text-white">
                                        cn-font-split v{PluginVersion()}
                                    </span>
                                    <a href="https://github.com/KonghaYao/cn-font-split">
                                        <img
                                            src="https://data.jsdelivr.com/v1/package/npm/@konghayao/cn-font-split/badge"
                                            alt="JSDeliver Badge"
                                        />
                                    </a>
                                </aside>
                            </header>
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

            <section class="flex h-full flex-col gap-4 overflow-hidden bg-gray-200 p-4">
                <header class="flex justify-between ">
                    <span class="text-xl">Logger 日志</span>
                    <a href="https://github.com/KonghaYao/cn-font-split/issues" target="_blank">
                        反馈
                    </a>
                </header>
                <Show when={startSplit.error()}>
                    <div class="text-red-600">
                        发生错误：{startSplit.error().message}{' '}
                        <button onclick={() => startSplit.refetch()}>点击此处刷新</button>
                    </div>
                </Show>
                <LogMessage logMessage={logMessage()}></LogMessage>
                <header class="text-xl">Output 输出文件</header>
                <FileList resultList={resultList()}></FileList>
                <span class="flex justify-end gap-4 text-xs">
                    <span>{resultList().length}</span>
                    <span>
                        {prettyBytes(resultList().reduce((col, i) => i.buffer.byteLength + col, 0))}
                    </span>

                    <button
                        class="rounded-lg bg-green-600 p-1 text-center  text-gray-100"
                        onclick={() => createZip.refetch()}
                    >
                        压缩下载 zip
                    </button>
                </span>
            </section>
        </section>
    );
};
import { createAutoAnimate } from '@formkit/auto-animate/solid';

/** 右下角的文件列表 */
function FileList(props: {
    resultList: {
        name: string;
        buffer: Uint8Array;
    }[];
}) {
    return (
        <ul class="flex h-full max-h-[100%] select-text flex-col-reverse overflow-scroll rounded-xl bg-gray-800 p-4 font-sans text-sm text-gray-100">
            <For each={[...props.resultList].reverse()}>
                {(item) => {
                    return (
                        <li>
                            <span class="col-span-2 inline-block min-w-[8rem]">
                                {prettyBytes(item.buffer.byteLength)}
                            </span>
                            <span class="col-span-6">{item.name}</span>
                        </li>
                    );
                }}
            </For>
        </ul>
    );
}

/** 右上角的文件列表 */
function LogMessage(props: { logMessage: string[] }) {
    const [parent] = createAutoAnimate();
    return (
        <ul
            ref={parent}
            class="flex h-full max-h-[100%] select-text flex-col-reverse overflow-scroll rounded-xl bg-gray-800  p-4 font-sans text-xs text-white"
        >
            <For each={[...props.logMessage].reverse()}>
                {(item) => {
                    return <li innerHTML={ConsolePrint(item)}></li>;
                }}
            </For>
        </ul>
    );
}
/** 修饰文本为可见的颜色 */
export const ConsolePrint = (item: string) => {
    return item
        .replace(
            /\[97m\[1m(.*?)\[22m\[39m\[0m\[0m/g,
            '<span style="color: green;font-weight: bold;" >$1</span>'
        )
        .replace(
            /\[34m\[1m(.*?)\[22m\[39m\[0m\[0m/g,
            '<span style="color: blue;font-weight: bold;" >$1</span>'
        );
};

function useResourceErrorWatch<T>(resource: ResourceAtom<T>) {
    useEffectWithoutFirst(() => Notice.error(resource.error().message), [resource.error]);
}
