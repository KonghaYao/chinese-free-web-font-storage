import { parse, type Font } from 'opentype.js';
import { VirtualContainer } from '@minht11/solid-virtual-container';
import { atom, reflect, resource, type Atom } from '@cn-ui/reactive';
import { RenderGlyph } from './RenderGlyph';
import { Show } from 'solid-js';
import { RenderGlyphDetail } from './RenderGlyphDetail';
import { convert } from 'https://cdn.jsdelivr.net/npm/@konghayao/cn-font-split/dist/browser/index.js';

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
        if (['.woff2', '.woff'].some((i) => props.file.name.endsWith(i))) {
            const buffer = await props.file.arrayBuffer();
            const otfBuffer = await convert(new Uint8Array(buffer), 'otf'); // wawoff2 is globaly loaded as 'Module'
            return parse(otfBuffer);
        }

        const buffer = await props.file.arrayBuffer();
        return parse(buffer);
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
    const detailRect = reflect(() => ({
        height: 500,
        width: 500,
    }));
    const config = reflect<GlyphConfig>(() => calcConfigBySize(size(), font()));
    const detailConfig = reflect(() => calcConfigBySize(500, font()));
    const displayingGlyphIndex = atom(0);
    const displayingGlyph = reflect(() => font().glyphs.get(displayingGlyphIndex()));

    return (
        <section class="flex h-[80vh]">
            <div class="h-full flex-1 overflow-auto " ref={scrollTargetElement}>
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
                            class="flex items-center justify-center"
                            // Required for items to switch places.
                            style={props.style}
                            // Used for keyboard navigation and accessibility.
                            tabIndex={props.tabIndex}
                            role="listitem"
                            onclick={() => displayingGlyphIndex(props.item.index)}
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
            <div class="flex flex-1 ">
                <Show when={font()}>
                    <RenderGlyphDetail
                        font={font()}
                        index={displayingGlyphIndex()}
                        config={detailConfig()}
                        rect={detailRect()}
                    ></RenderGlyphDetail>
                </Show>
                <div class="flex-1">
                    <ul>
                        {(
                            [
                                'index',
                                'name',
                                'xMin',
                                'xMax',
                                'yMin',
                                'yMax',
                                'advanceWidth',
                                'leftSideBearing',
                            ] as const
                        ).map((i) => {
                            return (
                                <li class="flex justify-between">
                                    <div>{i}</div>
                                    <div>{displayingGlyph()[i]}</div>
                                </li>
                            );
                        })}
                        <li class="flex justify-between">
                            <div>unicode</div>
                            <div>
                                {(displayingGlyph().unicodes ?? [displayingGlyph().unicode])
                                    .filter((i) => i)
                                    .map((i) => formatUnicode(i!))
                                    .join(',')}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
};
function formatUnicode(unicode_num: number) {
    const unicode = unicode_num.toString(16);
    if (unicode.length > 4) {
        return ('000000' + unicode.toUpperCase()).substr(-6);
    } else {
        return ('0000' + unicode.toUpperCase()).substr(-4);
    }
}
