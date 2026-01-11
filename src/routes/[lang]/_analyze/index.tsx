import { atom, resource } from '@cn-ui/reactive';
import { $t } from '~/i18n';
import type { FontAnalyze } from 'font-analyze';
import { Match, Switch } from 'solid-js';
import './analyze.css';
import { DragDropButton } from '~/components/DragButton';
import { StringObjectToTable } from './Coverage/StringObjectToTable';
import { UnicodeTable } from './Coverage/UnicodeTable';
import { StandardAnalyzeTable } from './Coverage/StandardAnalyzeTable';
import { FeatureTable } from './Feature/FeatureTable';

export type Result = Awaited<ReturnType<typeof FontAnalyze>>;
export default () => {
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
                    /** @ts-ignore */
                    'https://cdn.jsdelivr.net/npm/cn-font-split@6/dist/browser/index.js'
                );
                buffer = await convert(new Uint8Array(buffer), 'truetype', 'woff2');
            }
            fontURL(URL.createObjectURL(new Blob([buffer])));
            const { FontAnalyze } = await import(
                /** @ts-ignore */
                'https://cdn.jsdelivr.net/npm/font-analyze@1.3.3'
            );
            return FontAnalyze(buffer, {
                charsetLoader(name) {
                    return fetch(
                        `https://cdn.jsdelivr.net/npm/font-analyze@1.3.3/data/${name}`
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
                        <h2 class="text-xl">{$t('24dba98555da92ea160aa6a2107bb8c3')}</h2>
                        <DragDropButton
                            accept=".ttf,.otf,.woff2"
                            onGetFile={(file) => {
                                if (file) f(() => file);
                            }}
                        >
                            <button class="m-4 bg-rose-700 p-2 text-2xl text-white ">
                                {$t('7167cecd055aa815f86ebc04d349571b')}
                            </button>
                            <aside class="text-neutral-600">
                                {$t('b746a20501858a626c6ccf0833833b4e')}
                            </aside>
                            <aside class="text-neutral-600">
                                {$t('e6e2f7182101494f9e67ee09b393bd82')}
                            </aside>
                        </DragDropButton>
                    </section>
                </main>
            }
        >
            <Match when={analyzeResult.loading()}>{$t('74f3b2d4157f050f53d782a030806102')}</Match>
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
            <h2 class="py-2 text-center text-2xl">{$t('1734bbc74042351fda86df55ddb4688c')}</h2>
            <h3 class="flex justify-between py-2 text-center">
                <span>📖{filename}</span>
                <span>
                    <button class="px-2 text-blue-500 print:hidden " onclick={() => window.print()}>
                        {$t('8d74a519d1ee64454898c09c2b00522b')}
                    </button>
                    {$t('79088d97d72c2fea46a7d990b60c33f4')}
                </span>
            </h3>
            <details open>
                <summary>{$t('8a88fa369a9f19cfb66e5c52f4cf64ce')}</summary>
                <StringObjectToTable
                    data={result.headers.windows ?? result.headers}
                ></StringObjectToTable>
            </details>
            <details open>
                <summary>{$t('e7d4722d4073e1957aef3dd889bef049')}</summary>
                <StandardAnalyzeTable data={result.standard}></StandardAnalyzeTable>
            </details>
            <details open>
                <summary>{$t('af70ff198e3be489d401ef3ccf54d50f')}</summary>
                <UnicodeTable data={result.unicode}></UnicodeTable>
            </details>
            <details open>
                <summary>{$t('278c92d8c61f92a19acf04e26c98c7b3')}</summary>
                <FeatureTable
                    data={result.features}
                    getSVG={result.drawTextToSVG}
                    fontURL={fontURL}
                ></FeatureTable>
            </details>
        </article>
    );
};
