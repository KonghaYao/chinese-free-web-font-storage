import { Suspense, type Component, lazy } from 'solid-js';
import { atom } from '@cn-ui/use';
import { getFontReporter } from '../../utils/getFontReporter';
import type { FontReporter } from '../fonts/FontReporter';
export const AsyncReporterLoader = (Comp: Component<{ reporter: FontReporter }>) => {
    return (props: { font: string; fontName: string; reporter?: FontReporter }) => {
        let reporter = atom<FontReporter>(props.reporter as any);
        const Temp = lazy(async () => {
            reporter(await getFontReporter(props.font, props.fontName));
            return { default: Comp };
        });
        if (props.reporter) return <Comp reporter={reporter()}></Comp>;
        return (
            <Suspense fallback={null}>
                <Temp reporter={reporter()}></Temp>
            </Suspense>
        );
    };
};
