import { type Font } from 'opentype.js';
import { reflect } from '@cn-ui/reactive';
import { type GlyphConfig } from './GlyphInspector';

export const RenderGlyphDetail = (props: {
    markMode?: boolean;
    index: number;
    font: Font;
    config: GlyphConfig;
    opacity: number;
}) => {
    const svgPath = reflect(() => {
        const glyph = props.font.glyphs.get(props.index);
        return glyph
            .getPath(
                70 - ((glyph.advanceWidth ?? 0) * props.config.fontScale) / 2,
                props.config.glyphBaseline + 10,
                props.config.fontSize
            )
            .toSVG(2);
    });
    return (
        <svg
            viewBox="0 0 140 140"
            classList={{ 'h-full': true, 'bg-white': !props.markMode }}
            style={{
                opacity: props.opacity ?? 1,
            }}
            xmlns="http://www.w3.org/2000/svg"
            innerHTML={svgPath()}
        ></svg>
    );
};
