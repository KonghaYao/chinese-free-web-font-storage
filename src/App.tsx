import { Component, createResource, For, onCleanup, onMount, Show } from 'solid-js';
import { atom, createIgnoreFirst, reflect } from '@cn-ui/use';
import './home.css';
import { FontStore, useFontWatcher } from './page/FontStore';
import { useNavigate } from '@solidjs/router';
import { Notice } from './Notice';
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

export const App = () => {
    useFontWatcher();
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
                    <Show when={FontStore.projectIndex}>
                        <SearchBox></SearchBox>
                    </Show>
                </div>
            </section>
        </div>
    );
};

const SearchBox = () => {
    const keyName = reflect(() => {
        return new Map(
            Object.entries(FontStore.projectIndex.packages).map(
                (i) => i.reverse() as [string, string]
            )
        );
    });
    const nav = useNavigate();
    const list = reflect(() => Object.keys(keyName()));
    const packageKey = atom('');
    return (
        <>
            <input
                class=" mx-4 rounded-md p-2 font-medium outline-none ring ring-green-600"
                placeholder="搜索字体项目"
                value={packageKey()}
                type="search"
                name=""
                oninput={(e: any) => {
                    packageKey(e.target.value);
                }}
            />
            <button
                class="rounded-lg bg-red-600 p-2 text-white"
                onclick={() => {
                    const en = keyName().get(packageKey());
                    if (en) {
                        nav(`/fonts/${en}`);
                    } else {
                        Notice.error('没有找到该字体');
                    }
                }}
            >
                跳转
            </button>
        </>
    );
};
