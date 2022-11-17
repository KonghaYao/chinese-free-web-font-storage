export const FontUsage = () => {
    return (
        <div>
            <header>使用说明</header>

            <div class="flex gap-4 divide-y">
                <TextWriter></TextWriter>
                <CSSSupport></CSSSupport>
            </div>
        </div>
    );
};
import { TextWriter } from '../component/TextWriter';
import { CSSSupport } from '../component/CSSSupport';
