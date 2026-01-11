import { atom } from '@cn-ui/reactive';
import { $t } from '~/i18n';
import { VModel } from '~/utils/VModel';

export const TextWriter = () => {
    const fontSize = atom(48);
    const text = atom('');
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
                placeholder={$t('682c2bf39c9a96b15cdf8ea05ff9b753')}
                class="mt-4 h-64 w-full rounded-md p-2 outline-none ring-2 ring-rose-200"
                style={{
                    'font-size': fontSize() + 'px',
                    resize: 'none',
                }}
            ></textarea>
        </aside>
    );
};
