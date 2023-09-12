import { Suspense, type Component, lazy } from 'solid-js';
import { atom } from '@cn-ui/use';
import { getFontReporter } from '../../utils/getFontReporter';
import type { FontReporter } from '../fonts/FontReporter';
export const AsyncReporterLoader = (Comp: Component<{ reporter: FontReporter }>) => {
    return (props: { font: string; fontName: string }) => {
        let reporter = atom<FontReporter>();
        const Temp = lazy(async () => {
            reporter(await getFontReporter(props.font, props.fontName));
            return { default: Comp };
        });
        return (
            <Suspense fallback={null}>
                <Temp reporter={reporter()}></Temp>
            </Suspense>
        );
    };
};
