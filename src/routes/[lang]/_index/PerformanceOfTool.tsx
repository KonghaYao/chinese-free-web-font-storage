import NodeImage from '~/assets/logo/Node.js.svg?url';
import DenoImage from '~/assets/logo/Deno.svg?url';
import BunImage from '~/assets/logo/Bun.svg?url';
import ChromeImage from '~/assets/logo/Chrome.svg?url';
import FirefoxImage from '~/assets/logo/Firefox.svg?url';
import AppleSafariImage from '~/assets/logo/Apple Safari.svg?url';
import { DemoOfFontSplit } from '~/routes/[lang]/_index/DemoOfFontSplit';
import { $t, A } from '~/i18n';
const config = [
    {
        img: NodeImage,
        title: 'Node.js',
    },
    {
        img: DenoImage,
        title: 'Deno',
    },
    {
        img: BunImage,
        title: 'Bun',
    },
    {
        img: ChromeImage,
        title: 'Chrome',
    },
    {
        img: FirefoxImage,
        title: 'Firefox',
    },
    {
        img: AppleSafariImage,
        title: 'Safari',
    },
];
export default () => {
    return (
        <section class="dynamic-font w-full select-auto lg:w-[80%] snap-center font-serif max-w-7xl border-gray-200 text-gray-600 p-8 my-12 flex flex-col gap-4 mx-auto bg-white/70">
            <div class="py-12 px-8 text-center w-full gap-2 font-serif font-thin col-span-3 bg-rose-50/60 text-2xl hover:bg-rose-50 transition-colors">
                <a href="https://www.npmjs.com/package/cn-font-replacer" target="_blank">
                    <div class="text-2xl font-bold col-span-8 w-full">
                        {$t('450c1033d84d6e622b7e5e2627b6a4c0')}
                    </div>
                    <div class="my-4">{$t('4632fb328a4e1eb59340daa8e9480d63')}</div>
                    <div class="text-sm text-gray-500 my-2">
                        {$t('1d9171047b2121e89c6ea9a574540c4a')}
                    </div>
                </a>
            </div>
            <header class="grid grid-cols-2 bg-green-50/60  py-12 px-8 hover:bg-green-50 transition-colors">
                <ul class="gap-4  flex p-4 justify-center pb-8">
                    {config.map((i) => {
                        return (
                            <li class="relative w-fit flex-none rounded-full border border-gray-300 p-2">
                                <img
                                    loading="lazy"
                                    fetchpriority="low"
                                    class="h-12 w-12"
                                    height="48"
                                    width="48"
                                    src={i.img}
                                    alt={i.title}
                                />
                                <nav class=" absolute bottom-0 right-0 h-4 w-4 rounded-full text-center">
                                    ✅
                                </nav>
                            </li>
                        );
                    })}
                </ul>
                <a
                    href="https://www.npmjs.com/package/cn-font-split"
                    target="_blank"
                    class="w-full text-right text-2xl"
                >
                    <div class="font-black pr-8">cn-font-split</div>
                    <div class="my-4">{$t('9864c6709d117be727f9a0de1eed4892')}</div>
                </a>
                <div class=" text-neutral-400 w-full flex flex-row-reverse gap-4 flex-wrap col-span-2">
                    <span>{$t('96c8724fc94176ed7f535fc8e3247d0f')}</span>
                    <span>{$t('c017b66ead371f45453451201540c5d1')}</span>
                    <img
                        class="inline-block"
                        height={20}
                        width={138}
                        src="https://img.shields.io/npm/dw/cn-font-split"
                        loading="lazy"
                        alt={$t('a239e70392e274efd0d2ee44ccff38de')}
                        fetchpriority="low"
                    />

                    <A class="text-rose-700" href="https://www.npmjs.com/packages/cn-font-split">
                        {$t('8bdd4aa63ca4d3027b29199d226df808')}
                    </A>
                </div>
            </header>
            <DemoOfFontSplit></DemoOfFontSplit>
        </section>
    );
};
