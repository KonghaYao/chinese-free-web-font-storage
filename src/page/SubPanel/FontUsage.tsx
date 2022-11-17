import { TextWriter } from '../component/TextWriter';
import { CSSSupport } from '../component/CSSSupport';

export const FontUsage = () => {
    return (
        <div class="p-4">
            <header class="py-2 text-4xl">字体使用方式说明</header>

            <div class="flex flex-col-reverse gap-4 divide-y  md:flex-row">
                <TextWriter></TextWriter>
                <CSSSupport></CSSSupport>
            </div>
        </div>
    );
};
