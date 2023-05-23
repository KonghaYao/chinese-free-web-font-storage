import { atom } from '@cn-ui/use';
import {
    Component,
    createSelector,
    For,
    JSXElement,
    Match,
    Show,
    Switch,
    useContext,
} from 'solid-js';
import { FontInformation } from './SubPanel/FontInformation';

import { Coverage } from './SubPanel/Coverage';
import { FontUsage, WebSupport } from './SubPanel/FontUsage';
import { isServer } from 'solid-js/web';
import { DetailContextType, DetailedContext } from './DetailContext';

export const FontDetails: Component<DetailContextType> = (props) => {
    const ShowingPanel = atom('');
    const isShowingPanel = createSelector(ShowingPanel);
    const PanelList = [
        { value: 'information', label: '📄 字体详情' },
        { value: 'font-usage', label: '✒️ 尝试字体' },
        { value: 'web-support', label: '✨ Web 支持' },
        { value: 'coverage', label: '📦 中文覆盖率' },
    ];

    return (
        <DetailedContext.Provider value={{ ...props }}>
            <main class="relative flex  w-screen flex-col">
                <FontHome>
                    <nav class="flex flex-col justify-center gap-4 py-2 px-8">
                        <For each={PanelList}>
                            {(item) => {
                                return (
                                    <div
                                        class="flex-none cursor-pointer rounded-lg bg-white p-2 transition-colors duration-300 hover:bg-neutral-100 "
                                        onclick={() => ShowingPanel(item.value)}
                                    >
                                        {item.label}
                                    </div>
                                );
                            }}
                        </For>
                    </nav>
                </FontHome>

                <nav class="pointer-events-none absolute top-0 left-0 flex h-screen w-screen flex-col items-center justify-center overflow-hidden border-t border-gray-300 p-2 ">
                    <nav
                        class=" absolute top-0 left-0 h-screen w-screen"
                        classList={{
                            'pointer-events-auto': !!ShowingPanel(),
                        }}
                        onclick={() => {
                            ShowingPanel('');
                            console.log('关闭');
                        }}
                    ></nav>
                    <div
                        class="blur-background pointer-events-auto w-11/12 rounded-xl bg-white drop-shadow-lg transition-transform duration-700"
                        classList={{
                            'scale-100 translate-y-0': !!ShowingPanel(),
                            'scale-0 translate-y-96': !ShowingPanel(),
                        }}
                    >
                        <Show when={!isServer}>
                            <Switch>
                                <Match when={ShowingPanel() === 'coverage'}>
                                    <Coverage></Coverage>
                                </Match>
                                <Match when={ShowingPanel() === 'font-usage'}>
                                    <FontUsage></FontUsage>
                                </Match>
                                <Match when={ShowingPanel() === 'web-support'}>
                                    <WebSupport></WebSupport>
                                </Match>
                                <Match when={ShowingPanel() === 'information'}>
                                    <FontInformation></FontInformation>
                                </Match>
                            </Switch>
                        </Show>
                    </div>
                </nav>
            </main>
        </DetailedContext.Provider>
    );
};

const FontHome = (props: { children: JSXElement }) => {
    const showingPanel = atom('white');
    const isSelected = createSelector(showingPanel);
    const temp = [
        {
            name: '竖排文本',
            value: 'poetry',
            comp: Poetry,
        },
        {
            name: '白色背景',
            value: 'white',
            comp: BG,
        },
        {
            name: '黑色背景',
            value: 'black',
            comp: Poetry,
        },
    ];
    const FontStore = useContext(DetailedContext)!;
    return (
        <section class="my-4 flex w-screen  flex-1 flex-col">
            <header class="mb-8 p-4">
                <h1 class="text-2xl">
                    {FontStore.cnName}
                    <IconLink></IconLink>
                </h1>
                <aside class="text-xs text-gray-600">
                    由于本站资源较多，故加载稍慢，请稍等。可以尝试刷新页面。
                </aside>
            </header>

            <section class=" flex h-full flex-1 place-content-center overflow-y-auto">
                <nav class="flex flex-col items-center justify-center gap-4  px-4 py-2">
                    <a
                        href={`/heti.html?font=${FontStore.packageName}&name=${FontStore.subName}&family=${FontStore.reporter.message.fontFamily}&subFamily=${FontStore.reporter.message.fontSubFamily}`}
                        class="rounded-lg bg-white px-2 py-1 transition-colors  duration-300 hover:bg-neutral-100"
                    >
                        文章测试
                    </a>
                    <For each={temp}>
                        {(item) => {
                            return (
                                <button
                                    class="rounded-lg  px-2 py-1 transition-colors duration-300 hover:bg-neutral-100"
                                    classList={{
                                        'bg-sky-600 text-white': isSelected(item.value),
                                        'bg-white': !isSelected(item.value),
                                    }}
                                    onclick={() => showingPanel(item.value)}
                                >
                                    {item.name}
                                </button>
                            );
                        }}
                    </For>
                </nav>
                <section class="flex flex-1 items-center justify-center">
                    {isSelected('poetry') && <Poetry></Poetry>}
                    {isSelected('white') && <BG class="bg-white text-black"></BG>}
                    {isSelected('black') && <BG class="bg-black text-white"></BG>}
                </section>

                {props.children}
            </section>
        </section>
    );
};
const IconLink = () => {
    const FontStore = useContext(DetailedContext)!;
    const temp = [
        {
            // Github
            link: `https://github.com/KonghaYao/chinese-free-web-font-storage/tree/branch/packages/${FontStore.packageName}/fonts`,
            icon: 'https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons/icons/folder_type_github.svg',
        },
        {
            // NPM
            link: `https://www.npmjs.com/package/@chinese-fonts/${FontStore.packageName}`,
            icon: 'https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons/icons/file_type_npm.svg',
        },
    ];
    return (
        <span class="float-right flex gap-2 sm:gap-4">
            <For each={temp}>
                {(item) => {
                    return (
                        <a
                            href={item.link}
                            target="_blank"
                            class="overflow-hidden rounded-full bg-white  shadow-lg ring-amber-400 transition-all hover:ring"
                        >
                            <img class="h-8 w-8 sm:h-12 sm:w-12 " src={item.icon} alt="" />
                        </a>
                    );
                }}
            </For>
            <div></div>
        </span>
    );
};
const BG: Component<{ class: string }> = (props) => {
    const text =
        '景建传积寸严尽清川止诚基而德谷恶宝曰则温盛容初所仕去圣空因非君忠兴之映笃业登棠赞作正祸璧事力夙松取定荣优甘诗念表听尺父竭薄如安令学以克端习庆资当履渊辞宜竞存丝贤形堂善竞孝深斯息言终无政悲维立虚缘是敬临兰不思慎甚从墨行名声福阴与命似流若美籍取';
    return (
        <div class={'  flex w-fit rounded-2xl p-8 px-8 sm:px-16 ' + props.class}>
            <div class="flex flex-col justify-evenly pr-4  text-9xl sm:pr-8 ">
                <div>永</div>
                <div>远</div>
            </div>
            <div class="grid grid-cols-12 gap-1 text-lg">
                <For each={text.split('')}>
                    {(item) => {
                        return <div>{item}</div>;
                    }}
                </For>
            </div>
        </div>
    );
};

const Poetry = () => {
    return (
        <div class="poetry rounded-xl bg-white p-4">
            <header class="px-2 text-2xl">沁园春 雪</header>
            <p>北国风光，千里冰封，万里雪飘。</p>
            <p>望长城内外，惟余莽莽；</p>
            <p>大河上下，顿失滔滔。</p>
            <p>山舞银蛇，原驰蜡象，</p>
            <p>欲与天公试比高。 须晴日，</p>
            <p>看红装素裹，分外妖娆。</p>
            <p>江山如此多娇，引无数英雄竞折腰。</p>
            <p>惜秦皇汉武，略输文采；</p>
            <p>唐宗宋祖，稍逊风骚。</p>
            <p>一代天骄，成吉思汗，</p>
            <p>只识弯弓射大雕。</p>
            <p>俱往矣，数风流人物，还看今朝。</p>
            <nav class="float-right mr-4 rounded-md bg-red-600 p-1 text-sm text-white ">毛泽东</nav>
        </div>
    );
};
