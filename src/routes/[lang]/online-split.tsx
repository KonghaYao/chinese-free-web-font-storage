import { clientOnly } from '@solidjs/start';
import Layout from '~/layouts/HomeLayout';
const WasmSplit = clientOnly(() => import('./_online-split/wasm'));
export default () => {
    return (
        <Layout
            title={$t('9968557635555e59d673f29db4832aa0')}
            description={$t('799a430e341b71a8fbeee78f9180f6fa')}
            keywords={$t('b1b016d42d08a0b7838fa2d935d06246')}
        >
            <WasmSplit />
        </Layout>
    );
};
