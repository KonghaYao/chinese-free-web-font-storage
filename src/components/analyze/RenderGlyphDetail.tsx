import { type Font } from 'opentype.js';
import { atom } from '@cn-ui/reactive';
import { type ArrowConfig, drawPathWithArrows } from './paint/drawPathWithArrows';
import { createMemo, onMount } from 'solid-js';
import { type GlyphConfig } from './GlyphInspector';

export const RenderGlyphDetail = (props: {
    index: number;
    font: Font;
    config: GlyphConfig;
    rect: { height: number; width: number };
}) => {
    const canvas = atom<HTMLCanvasElement | null>(null);

    onMount(() => {
        createMemo(() => {
            renderGlyphDetail(canvas()!, props.index, props.font, props.rect, {
                ...props.config,
                arrowAperture: 4,
                arrowLength: 10,
            });
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
function renderGlyphDetail(
    canvas: HTMLCanvasElement,
    glyphIndex: number,
    font: Font,
    { height, width }: { height: number; width: number },
    config: GlyphConfig & ArrowConfig
) {
    const { glyphScale, glyphBaseline, glyphSize } = config;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, width, height);
    if (glyphIndex < 0) return;
    const glyph = font.glyphs.get(glyphIndex),
        glyphWidth = glyph.advanceWidth! * glyphScale,
        xmin = (width - glyphWidth) / 2,
        xmax = (width + glyphWidth) / 2,
        x0 = xmin,
        markSize = 10;
    drawMessageLine(glyphBaseline, glyphScale, ctx, width, height, font);

    ctx.fillStyle = '#606060';
    ctx.fillRect(xmin - markSize + 1, glyphBaseline, markSize, 1);
    ctx.fillRect(xmin, glyphBaseline, 1, markSize);
    ctx.fillRect(xmax, glyphBaseline, markSize, 1);
    ctx.fillRect(xmax, glyphBaseline, 1, markSize);

    ctx.textAlign = 'center';
    ctx.fillText('0', xmin, glyphBaseline + markSize + 10);
    ctx.fillText(glyph.advanceWidth!.toString(), xmax, glyphBaseline + markSize + 10);

    ctx.fillStyle = '#000000';
    var path = glyph.getPath(x0, glyphBaseline, glyphSize);
    path.fill = '#565656';
    path.stroke = '#000000';
    path.strokeWidth = 1.5;
    drawPathWithArrows(ctx, path, config);
    glyph.drawPoints(ctx, x0, glyphBaseline, glyphSize);
}

function drawMessageLine(
    glyphBaseline: number,
    glyphScale: number,
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    font: Font
) {
    function hline(text: string, yunits: number) {
        const ypx = glyphBaseline - yunits * glyphScale;
        ctx.fillText(text, 2, ypx + 3);
        ctx.fillRect(80, ypx, width, 1);
    }

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#a0a0a0';
    hline('Baseline', 0);
    hline('yMax', font.tables.head.yMax);
    hline('yMin', font.tables.head.yMin);
    hline('Ascender', font.tables.hhea.ascender);
    hline('Descender', font.tables.hhea.descender);
    hline('Typo Ascender', font.tables.os2.sTypoAscender);
    hline('Typo Descender', font.tables.os2.sTypoDescender);
}
