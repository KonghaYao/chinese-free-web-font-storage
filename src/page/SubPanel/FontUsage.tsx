import { TextWriter } from '../component/TextWriter';
import { CSSSupport } from '../component/CSSSupport';

export const FontUsage = () => {
    return (
        <div class="p-2 sm:p-4">
            <header class="py-2 text-4xl">字体尝试</header>

            <TextWriter></TextWriter>
        </div>
    );
};
export const WebSupport = () => {
    return (
        <div class="p-2 sm:p-4">
            <header class="py-2 text-4xl">Web 字体使用</header>

            <CSSSupport></CSSSupport>
        </div>
    );
};
