import viteLogo from '~/assets/viteLogo.svg?url';
import nextLogo from '~/assets/nextLogo.svg?url';
import nuxtLogo from '~/assets/nuxtLogo.svg?url';
import rspackLogo from '~/assets/rspackLogo.svg?url';
import astroLogo from '~/assets/astroLogo.svg?url';
import svelteLogo from '~/assets/svelteLogo.svg?url';
import { For } from 'solid-js';
import { $t } from '~/i18n';
const linker = [
    {
        name: 'Vite',
        href: 'https://github.com/KonghaYao/cn-font-bundler-demo/tree/vite',
        pic: viteLogo,
    },
    {
        name: 'Next.js',
        href: 'https://github.com/KonghaYao/cn-font-bundler-demo/tree/nest',
        pic: nextLogo,
    },
    {
        name: 'Nuxt',
        href: 'https://github.com/KonghaYao/cn-font-bundler-demo/tree/nuxt',
        pic: nuxtLogo,
    },
    {
        name: 'Astro',
        href: 'https://github.com/KonghaYao/cn-font-bundler-demo/tree/astro',
        pic: astroLogo,
    },
    {
        name: 'SvelteKit',
        href: 'https://github.com/KonghaYao/cn-font-bundler-demo/tree/svelte-kit',
        pic: svelteLogo,
    },
    {
        name: 'Rspack',
        href: 'https://github.com/KonghaYao/cn-font-bundler-demo/tree/rspack',
        pic: rspackLogo,
    },
];
export const DemoOfFontSplit = () => {
    return (
        <nav class="grid w-full max-w-7xl grid-cols-6 items-center gap-4 bg-cyan-50/60 hover:bg-cyan-50 px-8 py-12 transition-colors md:grid-cols-12">
            <div class="col-span-6 whitespace-nowrap">
                <span class="text-2xl font-bold transition-colors hover:text-green-600">
                    <a href="https://www.npmjs.com/package/vite-plugin-font" target="_blank">
                        {$t('948029bdee6242d67f8796cc7454bc94')}
                    </a>
                </span>
                <br />
                <span class="text-md mt-4 text-gray-600 ">
                    <span class="text-wrap">{$t('9949948d7b5fbcf9be875e1e0cd80669')}</span>
                    <div class="grid grid-cols-2">
                        {$t('884ad49489a5cacd264331e8275dedfe')
                            .split('|')
                            .map((item) => {
                                return <span>{item}</span>;
                            })}
                    </div>
                </span>
                <br />
                <a
                    href="https://www.npmjs.com/package/vite-plugin-font"
                    class="text-rose-700 flex gap-4"
                    target="_blank"
                >
                    <img
                        height={20}
                        width={138}
                        src="https://img.shields.io/npm/dw/vite-plugin-font"
                        loading="lazy"
                        alt={$t('a239e70392e274efd0d2ee44ccff38de')}
                        fetchpriority="low"
                    ></img>
                    {$t('fe7f7a4756a9aa11ba355bbfb932fc65')}
                </a>
            </div>
            <For each={linker}>
                {(item) => {
                    return (
                        <a
                            href={item.href}
                            target="_blank"
                            class="flex cursor-pointer flex-col items-center p-2 transition-colors  bg-transparent hover:bg-gray-100/70"
                        >
                            <img
                                src={item.pic}
                                alt={item.name}
                                height="45px"
                                width="45px"
                                fetchpriority="low"
                                loading="lazy"
                            ></img>
                            <span>{item.name}</span>
                            <span>Demo</span>
                        </a>
                    );
                }}
            </For>
        </nav>
    );
};
