import { Component, createResource, For, onCleanup, onMount } from 'solid-js';
import { atom, createIgnoreFirst } from '@cn-ui/use';
import './home.css';
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
    };
};

function useKeepFetch<T>(fetcher: (page: number) => T) {
    const page = atom(0);
    const dataStore = atom<T[]>([]);

    return {
        page,
        dataStore,

        async move(index: number) {
            if (index < 0) index = 0;
            const nextIndex = index;
            const data = await fetcher(nextIndex);
            dataStore((i) => {
                i[nextIndex] = data;
                return [...i];
            });
            page(nextIndex);
        },
    };
}

// https://api-docs.npms.io/ NPM 搜索 API
const useFontRemote = () => {
    const { dataStore, move } = useKeepFetch((page) =>
        fetch(`https://api.npms.io/v2/search?q=scope:@chinese-fonts&from=${page * 25}`)
    );

    return {};
};

export const App = () => {
    const { replaceFont } = useEasyFont();

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
                <div class=" xs:text-xl text-xs font-thin italic  leading-[1.1em] sm:text-4xl">
                    Web Chinese Fonts Plan
                </div>
                <header class="home-title xs:text-[8vh] text-[6vh] leading-[1.1em] sm:text-[12vh] lg:text-[20vh]">
                    中文网字计划
                </header>
                <nav class=" max-w-[30em] px-4 pt-4 text-xs font-thin sm:max-w-[30em] sm:text-lg lg:max-w-none lg:text-2xl">
                    中文网字计划是收录众多中文字体并通过 Web Font 的形式为
                    <b class="px-2 font-bold">网站开发者</b>
                    提供美丽字体的项目。
                </nav>

                <div class="pt-6">
                    <SearchBox></SearchBox>
                </div>
            </section>
        </div>
    );
};

const SearchBox = () => {
    const list = atom<string[]>(['姐夫姐夫']);
    return (
        <>
            <input
                class=" mx-4 rounded-md p-2 font-medium outline-none ring ring-green-600"
                placeholder="搜索字体项目"
                type="search"
                name=""
            />
            <button class="rounded-lg bg-red-600 p-2 text-white">跳转</button>
        </>
    );
};
