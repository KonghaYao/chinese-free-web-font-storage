import GoogleFont from '~/assets/logo/GoogleFont.svg?url';
import Netlify from '~/assets/logo/Netlify.svg?url';
import FontSource from '~/assets/logo/Fontsource.svg?url';
import Deno from '~/assets/logo/Deno.svg?url';
import { $t, A } from '~/i18n';
interface FriendLink {
    name: string;
    description: string;
    url: string;
    avatar: string;
}
const links = [
    {
        name: 'Google Fonts',
        description:
            'Google Fonts 旨在为全球的网页和应用程序提供广泛、多样化的字体资源。它是 Web 字体的先驱，我们的老前辈。',
        url: 'https://fonts.google.com/',
        avatar: GoogleFont,
    },
    {
        name: 'Deno Deploy',
        description:
            'Deno Deploy 是由 Deno 提供的一个无服务器计算平台。其支持了我们每日大量的后端服务。',
        url: 'https://deno.com/deploy',
        avatar: Deno,
    },
    {
        name: 'Netlify',
        description:
            'Netlify 提供了构建、托管和加速现代网络应用所需的工具和服务。整个中文网字计划的前端都是在这个平台构建部署的。',
        url: 'https://www.netlify.com/',
        avatar: Netlify,
    },
    {
        name: 'ImageKit',
        description:
            'ImageKit.io 是一个专注于媒体交付和管理的 CDN 平台，专为高增长团队设计。字图 CDN 也是基于 ImageKit 构建的。',
        url: 'https://imagekit.io/',
        avatar: 'https://ik.imgkit.net/ikmedia/logo/light_T4buIzohVH.svg',
    },
    {
        name: 'FontSource',
        description:
            'Fontsource 是一个开源字体的仓库，它提供了大量的免费可商用的字体，这些字体可以被开发者和设计师轻松地集成到他们的项目中。Fontsource 是中文网字计划的最初目标',
        url: 'https://fontsource.org/',
        avatar: FontSource,
    },
    {
        name: 'Bunny Fonts',
        description:
            'Bunny Fonts 是一个提供快速且遵守GDPR（通用数据保护条例）的字体服务的网站。提供与 Google Fonts 相近的字体服务',
        url: 'https://fonts.bunny.net/',
        avatar: 'https://bunny.net/v2/images/bunnynet-logo-dark.svg',
    },
] as FriendLink[];
export const FriendLinks = () => {
    return (
        <section class="mt-36 dynamic-font" id="friend-links">
            <h2
                class=" mb-6 text-center text-6xl"
                style={{
                    'letter-spacing': '2rem',
                }}
            >
                {$t('92e183477d73ec3bd4581391912caa23')}
            </h2>
            <h3 class=" mb-12 text-center text-xl text-neutral-400">
                {$t('f20b0f551d6b23ff4d3865dee5d5fd6c')}
            </h3>
            <ul class="m-auto mb-24 grid max-w-6xl grid-cols-4  ">
                {links.map((item) => {
                    return (
                        <A
                            href={item.url}
                            target="_blank"
                            class="relative flex flex-col items-center  bg-white p-8 border-b border-l hover:bg-gray-100 transition-colors"
                            title={item.description}
                        >
                            <img
                                class="h-16 object-contain"
                                src={item.avatar}
                                alt={item.name + $t('378b28892f45ed3caa0bd0ff0e67d26d')}
                                loading="lazy"
                            />
                            <div class="mt-2 line-clamp-3 text-xs text-neutral-500">
                                {item.description}
                            </div>
                            <div class="absolute text-center text-lg rotate-90 top-0 left-0 origin-bottom-left text-gray-400">
                                {item.name}
                            </div>
                        </A>
                    );
                })}
            </ul>
        </section>
    );
};
