import { atom, resource } from '@cn-ui/reactive';
import { FontAnalyze } from 'font-analyze';
import { Match, Switch, batch } from 'solid-js';
import '../../style/analyze.css';
import { DragDropButton } from '../DragButton';
import { StringObjectToTable } from './Coverage/StringObjectToTable';
import { UnicodeTable } from './Coverage/UnicodeTable';
import { StandardAnalyzeTable } from './Coverage/StandardAnalyzeTable';
import { GlyphInspector } from './Glyph/GlyphInspector';
import { FeatureTable } from './Feature/FeatureTable';

export type Result = Awaited<ReturnType<typeof FontAnalyze>>;
export const FontAnalyzeUI = () => {
    const url = atom(
        'https://cdn.jsdelivr.net/gh/harfbuzz/harfbuzzjs@0.3.3/examples/Roboto-Black.ttf'
    );
    const f = resource<File>(
        () =>
            fetch(url())
                .then((res) => res.blob())
                .then((res) => new File([res], new URL(url()).pathname)),
        { deps: [url], immediately: false }
    );
    const fontURL = atom('');
    const analyzeResult = resource(
        async () => {
            let buffer = await f()!.arrayBuffer();
            if (f().name.endsWith('.woff2')) {
                const { convert } = await import(
                    'https://jsdelivr.deno.dev/npm/@konghayao/cn-font-split/dist/browser/index.js'
                );
                buffer = await convert(new Uint8Array(buffer), 'truetype', 'woff2');
            }
            fontURL(URL.createObjectURL(new Blob([buffer])));
            return FontAnalyze(buffer, {
                charsetLoader(name) {
                    return fetch(
                        `https://jsdelivr.deno.dev/npm/font-analyze@1.3.3/data/${name}`
                    ).then((res) => res.json());
                },
            }).then((result) => {
                return { filename: f()!.name, result };
            });
        },
        { immediately: false, deps: [f] }
    );
    return (
        <Switch
            fallback={
                <main>
                    <section class="flex w-full flex-col items-center justify-center p-12">
                        <h1 class="text-xl">在线字体分析器</h1>
                        <DragDropButton
                            accept=".ttf,.otf,.woff2"
                            onGetFile={(file) => {
                                if (file) f(() => file);
                            }}
                        >
                            <button class="m-4 bg-rose-700 p-2 text-2xl text-white ">
                                上传字体文件
                            </button>
                            <aside class="text-neutral-600">
                                中文网字计划将会分析您的字体文件，并提供一份详尽的分析报告
                            </aside>
                            <aside class="text-neutral-600">支持 .ttf、.otf、.woff2</aside>
                        </DragDropButton>
                    </section>
                </main>
            }
        >
            <Match when={analyzeResult.loading()}>🔔正在积极导入数据中，请稍等。。。</Match>
            <Match when={analyzeResult.isReady() && analyzeResult()}>
                <AnalyzeResult
                    filename={analyzeResult().filename}
                    result={analyzeResult().result}
                    fontURL={fontURL()}
                ></AnalyzeResult>
                {/* <GlyphInspector file={f()}></GlyphInspector> */}
            </Match>
        </Switch>
    );
};
const AnalyzeResult = ({
    result,
    filename,
    fontURL,
}: {
    result: Result;
    filename: string;
    fontURL: string;
}) => {
    return (
        <article class="mx-auto my-8 min-h-[80vh]  max-w-3xl bg-white p-8 lg:max-w-6xl">
            <h1 class="py-2 text-center text-2xl">字体检测报告</h1>
            <h2 class="flex justify-between py-2 text-center">
                <span>📖{filename}</span>
                <span>
                    <button class="px-2 text-blue-500 print:hidden " onclick={() => window.print()}>
                        打印
                    </button>
                    ✨中文网字计划提供
                </span>
            </h2>
            <details>
                <summary>字体首部信息表</summary>
                <StringObjectToTable
                    data={result.headers.windows ?? result.headers}
                ></StringObjectToTable>
            </details>
            <details open>
                <summary>字体字符标准检测</summary>
                <StandardAnalyzeTable data={result.standard}></StandardAnalyzeTable>
            </details>
            <details open>
                <summary>Unicode 统一码全字符检测</summary>
                <UnicodeTable data={result.unicode}></UnicodeTable>
            </details>
            <details>
                <summary>OpenType Features</summary>
                <FeatureTable
                    data={result.features}
                    getSVG={result.drawTextToSVG}
                    fontURL={fontURL}
                ></FeatureTable>
            </details>
        </article>
    );
};
