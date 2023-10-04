import { type Font } from '@konghayao/opentype.js';
import { VirtualContainer } from '@minht11/solid-virtual-container';
import { atom, reflect, resource, type Atom, ArrayAtom, VModel, ObjectAtom } from '@cn-ui/reactive';
import { RenderGlyph } from './RenderGlyph';
import { For, Show } from 'solid-js';
import { RenderGlyphDetail } from './RenderGlyphDetail';

export interface GlyphConfig {
    fontScale: number;
    fontSize: number;
    fontBaseline: number;
    glyphScale: number;
    glyphSize: number;
    glyphBaseline: number;
    cellMarkSize: number;
}
const calcConfigBySize = (size: number, font: Font) => {
    const w = size,
        h = size,
        head = font.tables.head,
        maxHeight = head.yMax - head.yMin,
        glyphW = w,
        glyphH = h;
    const fontScale = Math.min(w / (head.xMax - head.xMin), h / maxHeight);
    const fontSize = fontScale * font.unitsPerEm;
    const fontBaseline = (h * head.yMax) / maxHeight;
    const glyphScale = Math.min(glyphW / (head.xMax - head.xMin), glyphH / maxHeight);
    const glyphSize = glyphScale * font.unitsPerEm;
    const glyphBaseline = (glyphH * head.yMax) / maxHeight;
    return {
        fontScale,
        fontSize,
        fontBaseline,
        glyphSize,
        glyphScale,
        glyphBaseline,
        cellMarkSize: 4,
    };
};
export const GlyphInspector = (props: { file: File }) => {
    const font = resource(async () => {
        const opentype = await import('@konghayao/opentype.js');
        if (['.woff2', '.woff'].some((i) => props.file.name.endsWith(i))) {
            const buffer = await props.file.arrayBuffer();
            const { convert } = await import(
                'https://cdn.jsdelivr.net/npm/@konghayao/cn-font-split/dist/browser/index.js'
            );
            const otfBuffer = await convert(new Uint8Array(buffer), 'truetype', 'woff2');
            return opentype.parse(otfBuffer);
        }

        const buffer = await props.file.arrayBuffer();
        return opentype.parse(buffer);
    });
    return (
        <Show when={font.isReady() && font()}>
            <GlyphInspectorUI font={font}></GlyphInspectorUI>
        </Show>
    );
};
const GlyphInspectorUI = ({ font }: { font: Atom<Font> }) => {
    let scrollTargetElement!: HTMLDivElement;
    const glyphIndexList = reflect(() =>
        [...Array(font()?.numGlyphs ?? 0).keys()].map((i) => ({ index: i }))
    );
    const size = atom(100);
    const cellRect = reflect(() => ({
        height: size(),
        width: size(),
    }));
    const config = reflect<GlyphConfig>(() => calcConfigBySize(size(), font()));
    const detailConfig = reflect(() => calcConfigBySize(120, font()));
    const displayingGlyphIndex = ArrayAtom([1]);
    const setting = ObjectAtom({
        opacity: 5000,
        multiSelect: false,
    });
    return (
        <section class="m-auto grid h-[90vh] w-[90%]  grid-cols-2 rounded-2xl  p-8">
            <div class="col-span-2 flex gap-4">
                <button class="cursor-pointer" onclick={() => displayingGlyphIndex((i) => [i[0]])}>
                    归一
                </button>
                <button
                    class="cursor-pointer"
                    onclick={() => displayingGlyphIndex(() => glyphIndexList().map((i) => i.index))}
                >
                    全选
                </button>
                <label class="cursor-pointer">
                    <input
                        type="checkbox"
                        oninput={(e) => {
                            setting.multiSelect(e.target.checked);
                            if (!e.target.checked) displayingGlyphIndex((i) => [i[0]]);
                        }}
                        checked={setting.multiSelect()}
                    />
                    多选字符
                </label>
                <label>
                    <input type="range" max={10000} min={0} {...VModel(setting.opacity)} />
                    透明度：{setting.opacity() / 100}
                </label>
                <div class="flex-1"></div>

                <a href="/analyze" class="text-xl">
                    字符查看器
                </a>
            </div>
            <div
                class="h-full overflow-auto rounded-l-2xl border-2  bg-gray-100"
                ref={scrollTargetElement}
            >
                <VirtualContainer
                    items={glyphIndexList()}
                    class="flex"
                    scrollTarget={scrollTargetElement}
                    // Define size you wish your list items to take.
                    itemSize={{ height: cellRect().height + 20, width: cellRect().width + 20 }}
                    crossAxisCount={(measurements: {
                        container: { cross: number };
                        itemSize: { cross: number };
                    }) => {
                        return Math.floor(
                            measurements.container.cross / measurements.itemSize.cross
                        );
                    }}
                >
                    {(props: any) => (
                        <div
                            class="flex cursor-pointer items-center justify-center transition-colors"
                            classList={{
                                'bg-gray-400': displayingGlyphIndex().includes(props.item.index),
                            }}
                            // Required for items to switch places.
                            style={props.style}
                            // Used for keyboard navigation and accessibility.
                            tabIndex={props.tabIndex}
                            role="listitem"
                            onclick={() => {
                                if (setting.multiSelect()) {
                                    if (displayingGlyphIndex().includes(props.item.index)) {
                                        displayingGlyphIndex.remove(props.item.index);
                                    } else {
                                        displayingGlyphIndex((i) => [...i, props.item.index]);
                                    }
                                } else {
                                    displayingGlyphIndex(() => [props.item.index]);
                                }
                            }}
                        >
                            <RenderGlyph
                                font={font()}
                                index={props.item.index}
                                config={config()}
                                rect={cellRect()}
                            ></RenderGlyph>
                        </div>
                    )}
                </VirtualContainer>
            </div>
            <div class="flex items-center justify-center  rounded-r-2xl border-2 bg-gray-100 p-4">
                <Show when={font()}>
                    <ul class="relative aspect-square h-full">
                        <For each={displayingGlyphIndex()}>
                            {(index, listIndex) => {
                                return (
                                    <li class="absolute left-0 top-0 h-full w-full">
                                        <RenderGlyphDetail
                                            markMode={listIndex() > 0}
                                            font={font()}
                                            index={index}
                                            opacity={setting.opacity() / 10000}
                                            config={detailConfig()}
                                        ></RenderGlyphDetail>
                                    </li>
                                );
                            }}
                        </For>
                    </ul>
                </Show>
            </div>
        </section>
    );
};
