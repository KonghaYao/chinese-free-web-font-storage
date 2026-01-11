import './CDNHome.less';

import Deno from '~/assets/logo/Deno.svg?url';
import Netlify from '~/assets/logo/Netlify.svg?url';
import { $t } from '~/i18n';
export function ServerLink() {
    return (
        <div class="mb-12 flex h-10  gap-6  col-span-12">
            <a href="https://deno.com/deploy" class="flex h-full flex-none " target="_blank">
                <img src={Deno} alt={$t('c80c06fb5357ef07ffa85a132bef6e04')}></img>
            </a>
            <a href="https://netlify.com/" class="flex h-full flex-none" target="_blank">
                <img src={Netlify} alt={$t('f55e9689a49912e242cbe143f83b07e9')}></img>
            </a>
            <a href="https://imagekit.io" class="flex h-full flex-none" target="_blank">
                <img
                    class="scale-75"
                    src="/brand/imagekit.svg"
                    alt={$t('5e2b57e609019a3dcea17d0f7ef906a1')}
                ></img>
            </a>
        </div>
    );
}
