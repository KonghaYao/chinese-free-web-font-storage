import { atom, createIgnoreFirst } from '@cn-ui/use';
import './home.css';
import { initFontStore } from './page/FontStore';
import { SearchBox } from './SearchBox';
import { A } from '@solidjs/router';
let link: HTMLLinkElement;
export const useEasyFont = () => {
    const Url = atom('');
    if (!link) {
        link = document.createElement('link');
        link.rel = 'stylesheet';
        createIgnoreFirst(() => {
            link.href = Url();
        }, [Url]);
        document.body.appendChild(link);
    }

    return {
        replaceFont(url: string, name: string, weight = 'normal') {
            document.body.style.setProperty('--defaultFont', name);
            document.body.style.fontWeight = weight;
            return Url(url);
        },
        addFont(url: string) {
            link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            document.body.appendChild(link);
            return link;
        },
    };
};

export const App = () => {
    initFontStore();
    return (
        <div class="relative h-screen w-screen">
            <div class="pointer-events-none ">
                <div
                    class=" absolute top-48 -left-16  text-gray-300 opacity-50"
                    style="font-size:50vh"
                >
                    江
                </div>
                <div
                    class=" absolute top-48 -right-24  text-gray-300 opacity-50"
                    style='font-family:"jiangxizhuokai";font-size:30vh'
                >
                    夏
                </div>
                <div
                    class="absolute top-0 left-8  text-gray-300 opacity-50"
                    style='font-family:"jiangxizhuokai";font-size:20vh'
                >
                    尧
                </div>
            </div>

            <section class="absolute z-10 flex h-screen w-screen flex-col items-center justify-center">
                <div class=" xs:text-xl text-xs font-thin italic  leading-[1.1em] text-gray-600 sm:text-4xl">
                    Web Chinese Fonts Plan
                </div>
                <header class="home-title xs:text-[8vh] text-[6vh] leading-[1.1em] sm:text-[12vh] lg:text-[20vh]">
                    中文网字计划
                </header>
                <nav class=" max-w-[30em] px-4 pt-4 text-xs font-thin text-gray-600 sm:max-w-[30em] sm:text-lg lg:max-w-none lg:text-2xl">
                    中文网字计划是收录众多中文字体并通过 Web Font 的形式为
                    <b class="px-2 font-bold">网站开发者</b>
                    提供美丽字体的项目。
                </nav>

                <div class="pt-6">
                    <A href="/search">
                        <SearchBox></SearchBox>
                    </A>
                </div>
                <div class="absolute right-2 top-2 flex gap-2  text-white">
                    <A
                        href="https://github.com/KonghaYao/chinese-free-web-font-storage/tree/branch"
                        target="_blank"
                        class="rounded-lg bg-gray-800 px-4"
                    >
                        Github
                    </A>
                    <A href="/google" class="rounded-lg bg-blue-600 px-4">
                        Google Font
                    </A>
                </div>
            </section>
        </div>
    );
};
