import { type Font } from 'opentype.js';
import { atom } from '@cn-ui/reactive';
import { createMemo, onMount } from 'solid-js';
import type { GlyphConfig } from './GlyphInspector';

export const RenderGlyph = (props: {
    index: number;
    font: Font;
    config: GlyphConfig;
    rect: { height: number; width: number };
}) => {
    const canvas = atom<HTMLCanvasElement | null>(null);

    onMount(() => {
        createMemo(() => {
            renderGlyphItem(canvas()!, props.index, props.font, props.rect, props.config);
        });
    });
    return (
        <canvas
            class="bg-white"
            ref={canvas}
            height={props.rect.height}
            width={props.rect.width}
        ></canvas>
    );
};

function renderGlyphItem(
    canvas: HTMLCanvasElement,
    glyphIndex: number,
    font: Font,
    { height, width }: { height: number; width: number },
    config: GlyphConfig
) {
    const { fontScale, fontSize, fontBaseline } = config;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, width, height);
    if (glyphIndex >= font.numGlyphs) return;

    ctx.fillStyle = '#606060';
    ctx.font = '9px sans-serif';
    ctx.fillText(glyphIndex.toString(), 1, height - 1);
    const glyph = font.glyphs.get(glyphIndex);
    const glyphWidth = (glyph.advanceWidth ?? 0) * fontScale,
        xmin = (width - glyphWidth) / 2,
        xmax = (width + glyphWidth) / 2,
        x0 = xmin;
    addCellMark(ctx, xmin, xmax, config);

    ctx.fillStyle = '#000000';
    glyph.draw(ctx, x0, fontBaseline, fontSize);
}
/** 灰色的角标 */
function addCellMark(
    ctx: CanvasRenderingContext2D,
    xmin: number,
    xmax: number,
    { cellMarkSize, fontBaseline }: GlyphConfig
) {
    ctx.fillStyle = '#a0a0a0';
    ctx.fillRect(xmin - cellMarkSize + 1, fontBaseline, cellMarkSize, 1);
    ctx.fillRect(xmin, fontBaseline, 1, cellMarkSize);
    ctx.fillRect(xmax, fontBaseline, cellMarkSize, 1);
    ctx.fillRect(xmax, fontBaseline, 1, cellMarkSize);
}
