import { atom } from '@cn-ui/reactive';
import { clientOnly } from '@solidjs/start';
import { Show } from 'solid-js';
import Layout from '~/layouts/HomeLayout';
const WasmSplit = clientOnly(() => import('./_online-split/wasm'));
const Split = clientOnly(() => import('./_online-split/index'));
export default () => {
    const isBeta = atom(true);
    return (
        <Layout
            title={$t('9968557635555e59d673f29db4832aa0')}
            description={$t('799a430e341b71a8fbeee78f9180f6fa')}
            keywords={$t('b1b016d42d08a0b7838fa2d935d06246')}
        >
            <Show when={isBeta()} fallback={<Split></Split>}>
                <WasmSplit />
            </Show>
            <button class="block m-auto text-gray-400" onClick={() => isBeta(!isBeta())}>
                切换版本 == 您现在是
                {isBeta() ? '最新 Beta Wasm 版本，速度极快，如遇 BUG 可切换' : ' 最新稳定版本'}
            </button>
        </Layout>
    );
};
