import { Suspense, type Component, lazy } from 'solid-js';
import { atom } from '@cn-ui/use';
import { getFontReporter } from '../../utils/getFontReporter';
import type { FontReporter } from '@konghayao/cn-font-split';

/** 报告加载器 */
export const AsyncReporterLoader = (
    Comp: Component<{ font: string; fontName: string; reporter: FontReporter }>
) => {
    return (props: { font: string; fontName: string; reporter?: FontReporter }) => {
        let reporter = atom<FontReporter>(props.reporter as any);
        const Temp = lazy(async () => {
            reporter(await getFontReporter(props.font, props.fontName));
            return { default: Comp };
        });
        if (props.reporter) return <Comp reporter={reporter()} {...props}></Comp>;
        return (
            <Suspense fallback={null}>
                <Temp reporter={reporter()} {...props}></Temp>
            </Suspense>
        );
    };
};
