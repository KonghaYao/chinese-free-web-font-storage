import { atom } from '@cn-ui/use';

export const TextWriter = () => {
    const fontSize = atom(48);
    return (
        <aside class="flex flex-1 flex-col p-4">
            <div class="flex justify-between">
                <div>{fontSize}px</div>
                <input
                    class="ml-8 flex-1"
                    type="range"
                    value={fontSize()}
                    min={12}
                    step={2}
                    max={64}
                    oninput={(e: any) => fontSize(parseInt(e.target.value))}
                />
            </div>
            <textarea
                placeholder="中文测试器，你可以在这里写任何字来测试字体！"
                class="mt-4 h-64 w-full rounded-md p-2 outline-none ring-2 ring-green-600"
                style={{
                    'font-size': fontSize() + 'px',
                    resize: 'none',
                }}
            ></textarea>
        </aside>
    );
};
