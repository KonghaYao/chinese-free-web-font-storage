import { atom } from '@cn-ui/reactive';
import { Show } from 'solid-js';
import { DragDropButton } from '../DragButton';
import type { FontReporter } from '@konghayao/cn-font-split';
import { TimeAnalyze } from '../fontDisplay/TimeAnalyze';
import { BundleSizeAnalyze } from '../fontDisplay/BundleSizeAnalyze';
import { TextWriter } from '../fontDisplay/TextWriter';
export const ShowReporter = () => {
    const reporter = atom<FontReporter | undefined>(undefined);
    return (
        <section class="grid h-full grid-cols-12 gap-8 ">
            <Show
                when={reporter()}
                fallback={
                    <DragDropButton
                        class="col-span-12"
                        accept=".ttf,.otf"
                        onGetFile={async (f) => {
                            const json = await f.text();
                            reporter(() => JSON.parse(json));
                        }}
                    >
                        <div class="bg-white pb-2 text-xl ">请上传字体打包的 reporter 文件</div>
                    </DragDropButton>
                }
            >
                <section class="col-span-12 flex justify-end p-4">
                    <span
                        class="scale-125 cursor-pointer"
                        onclick={() => reporter(() => undefined)}
                    >
                        🔁
                    </span>
                </section>
                <section class="col-span-6">
                    <TimeAnalyze font="" fontName="" reporter={reporter()}></TimeAnalyze>
                </section>
                <section class="col-span-6">
                    <BundleSizeAnalyze
                        font=""
                        fontName=""
                        reporter={reporter()}
                    ></BundleSizeAnalyze>
                </section>
                <section class="col-span-6">
                    <TextWriter font="" fontName="" reporter={reporter()}></TextWriter>
                </section>
            </Show>
        </section>
    );
};
