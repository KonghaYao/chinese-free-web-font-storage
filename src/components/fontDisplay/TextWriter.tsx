import { atom, reflect, resource } from '@cn-ui/use';
import { AsyncReporterLoader } from './AsyncReporterLoader';
import { UnicodeRange } from '@japont/unicode-range';
import prettyBytes from 'pretty-bytes';
import { VModel } from '@cn-ui/reactive';

export const TextWriter = AsyncReporterLoader((props) => {
    const data = props.reporter;
    const packages = data.data.map((i) => {
        return { ...i, chars: new Set(UnicodeRange.parse(i.chars.split(','))) };
    });
    const fontSize = atom(48);
    const text = atom('');
    const textCodes = reflect(() =>
        text()
            .split('')
            .map((i) => i.charCodeAt(0))
    );
    const usedPackages = reflect(() => {
        const usedPackages = new Set<{
            chars: Set<number>;
            name: string;
            size: number;
        }>();

        for (const iterator of textCodes()) {
            const item = packages.find((i) => i.chars.has(iterator));
            if (item) usedPackages.add(item);
        }
        return [...usedPackages];
    });
    const usedRate = reflect(() => {
        const rate =
            (new Set(textCodes()).size * 100) /
            usedPackages().reduce((col, i) => col + i.chars.size, 0);
        return isNaN(rate) ? 0 : rate.toFixed(2);
    });
    const usedSize = reflect(() => usedPackages().reduce((col, cur) => col + cur.size, 0));
    return (
        <aside class="flex flex-1 flex-col p-4">
            <div class="flex justify-between">
                <div>{fontSize()}px</div>
                <input
                    class="ml-8 flex-1"
                    type="range"
                    value={fontSize()}
                    min={12}
                    step={2}
                    max={64}
                    oninput={(e: any) => fontSize(parseInt(e.target.value))}
                />
                {/* <div onclick={() => text.refetch()}>重置</div> */}
            </div>
            <textarea
                {...VModel(text)}
                placeholder="中文测试器，你可以在这里写任何字来测试字体！"
                class="mt-4 h-64 w-full rounded-md p-2 outline-none ring-2 ring-green-600"
                style={{
                    'font-size': fontSize() + 'px',
                    resize: 'none',
                }}
            ></textarea>
            <div class="flex gap-3">
                <span>加载这些文字大致需要 {usedPackages().length} 个分包</span>
                <span>耗费 {prettyBytes(usedSize())}</span>
                <span>字符使用率 {usedRate()}%</span>
            </div>
        </aside>
    );
});
