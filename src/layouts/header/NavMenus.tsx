import { Popover } from '@cn-ui/core';
import { MdiGithub } from '../../components/icons/MdiGithub';
import { $t } from '~/i18n';

interface NavMenusProps {
    lang: string;
}

export const NavMenus = (props: NavMenusProps) => {
    const getHref = (path: string) => `/${props.lang}${path.startsWith('/') ? '' : '/'}${path}`;

    return (
        <>
            <Popover
                trigger="hover"
                content={() => (
                    <ul class="w-64 bg-gray-50 border">
                        <li class="p-2 hover:bg-gray-100">
                            <a href={getHref('/analyze/')} class="block w-full">
                                {$t('0a5741d8beeabccf7c7cc829f61eaf84')}
                            </a>
                        </li>
                    </ul>
                )}
            >
                <button class="outline-none">{$t('0ec9eaf9c3525eb110db58aae5912210')}</button>
            </Popover>

            <span class="w-px bg-gray-300 h-4"></span>

            <Popover
                trigger="hover"
                content={() => (
                    <ul class="w-64 bg-gray-50 border">
                        <li class="p-2 hover:bg-gray-100">
                            <a
                                href="https://github.com/KonghaYao/chinese-free-web-font-storage"
                                target="_blank"
                                class="block"
                            >
                                <div class="text-sm text-neutral-500">
                                    chinese-free-web-font-storage
                                </div>
                                <h3 class="text-xl">{$t('e26f7451c6262ee407dd01220cabc7b1')}</h3>
                                <div>
                                    <img
                                        alt={$t('5c30ffa0bbcea21194c6d9073273a161')}
                                        loading="lazy"
                                        src="https://img.shields.io/github/stars/KonghaYao/chinese-free-web-font-storage?style=flat"
                                    />
                                </div>
                            </a>
                        </li>
                        <li class="p-2 hover:bg-gray-100">
                            <a
                                href="https://github.com/KonghaYao/cn-font-split"
                                target="_blank"
                                class="block"
                            >
                                <div class="text-sm text-neutral-500">cn-font-split</div>
                                <h3 class="text-xl">{$t('48928df0c05291cade11cc715c77f43d')}</h3>
                                <div class="flex gap-2">
                                    <img
                                        alt={$t('5c30ffa0bbcea21194c6d9073273a161')}
                                        loading="lazy"
                                        src="https://img.shields.io/github/stars/KonghaYao/cn-font-split?style=flat"
                                    />
                                    <img
                                        alt={$t('5c30ffa0bbcea21194c6d9073273a161')}
                                        loading="lazy"
                                        src="https://data.jsdelivr.net/v1/package/npm/cn-font-split/badge?style=rounded"
                                    />
                                </div>
                            </a>
                        </li>
                        <li class="p-2 hover:bg-gray-100">
                            <a
                                href="https://github.com/KonghaYao/font-server"
                                target="_blank"
                                class="block"
                            >
                                <div class="text-sm text-neutral-500">font-server</div>
                                <h3 class="text-xl">{$t('0939794ddbc872708aa6a5ba70c44c83')}</h3>
                                <div>
                                    <img
                                        alt={$t('5c30ffa0bbcea21194c6d9073273a161')}
                                        loading="lazy"
                                        src="https://img.shields.io/github/stars/KonghaYao/font-server?style=flat"
                                    />
                                </div>
                            </a>
                        </li>
                    </ul>
                )}
                title={$t('e1adbcbb92c622d0b3e619f9d0730abf')}
            >
                <MdiGithub />
            </Popover>
        </>
    );
};
