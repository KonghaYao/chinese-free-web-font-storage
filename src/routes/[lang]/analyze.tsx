import { __CDN__ } from '../../global';
import Layout from '~/layouts/HomeLayout';
import { $t } from '~/i18n';
import { clientOnly } from '@solidjs/start';

const FontAnalyzeUI = clientOnly(() => import('./_analyze/index'));
export default () => {
    return (
        <Layout title={$t('24dba98555da92ea160aa6a2107bb8c3')} description="" keywords="">
            <FontAnalyzeUI />
        </Layout>
    );
};
