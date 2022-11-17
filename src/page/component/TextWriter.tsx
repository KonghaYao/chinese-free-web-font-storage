import { atom } from '@cn-ui/use';

export const TextWriter = () => {
    const fontSize = atom(32);
    return (
        <div class="flex flex-1 flex-col p-4">
            <div class="flex justify-between">
                <div>{fontSize}px</div>
                <input
                    class="ml-8 flex-1"
                    type="range"
                    value={fontSize()}
                    min={0}
                    max={200}
                    oninput={(e: any) => fontSize(parseInt(e.target.value))}
                />
            </div>
            <textarea
                placeholder="中文测试器，你可以在这里写字来测试字体！拖拽右下角可以改变书写框大小！"
                class="mt-4 h-full w-full rounded-md p-2 outline-none ring-2 ring-green-600"
                style={{
                    'font-size': fontSize() + 'px',
                }}
            ></textarea>
        </div>
    );
};
