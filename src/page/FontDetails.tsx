import { atom } from '@cn-ui/use';
import { A, useParams } from '@solidjs/router';
import { batch, Component, createSelector, For, Match, Show, Switch } from 'solid-js';
import { FontInformation } from './SubPanel/FontInformation';
import { setFontStore, initFontStore, FontStore } from './FontStore';
import { Coverage } from './SubPanel/Coverage';
import { FontUsage, WebSupport } from './SubPanel/FontUsage';

export const FontDetails = () => {
    const { packageName } = useParams();
    batch(() => {
        setFontStore('packageName', packageName);
    });

    initFontStore().then(async (api) => {
        await api.loadFontList();
        await api.loadSingleFont();
        await api.ChangeFont();
    });

    const ShowingPanel = atom('');
    const PanelList = [
        { value: '', label: '隐藏' },
        { value: 'information', label: '字体详情' },
        { value: 'font-usage', label: '尝试字体' },
        { value: 'web-support', label: 'Web 支持' },
        { value: 'coverage', label: '中文覆盖率' },
    ];
    return (
        <div class="relative flex h-screen w-screen flex-col">
            <FontHome></FontHome>
            <div class="flex justify-center gap-4 py-2">
                <For each={PanelList}>
                    {(item) => {
                        return (
                            <div
                                class="cursor-pointer rounded-lg bg-neutral-200 p-2 text-lg transition-colors duration-300"
                                classList={{
                                    ['bg-green-600 text-white']: ShowingPanel() === item.value,
                                }}
                                onclick={() => ShowingPanel(item.value)}
                            >
                                {item.label}
                            </div>
                        );
                    }}
                </For>
            </div>
            <nav class="pointer-events-none absolute top-0 left-0 flex h-screen w-screen flex-col items-center justify-center overflow-hidden border-t border-gray-300 p-2 ">
                <div
                    class="blur-background pointer-events-auto w-11/12 rounded-xl bg-white drop-shadow-lg "
                    data-self={true}
                    onclick={(e) => {
                        if ((e.target as HTMLElement).dataset.self && ShowingPanel() !== '') {
                            ShowingPanel('');
                            console.log('关闭');
                        }
                    }}
                >
                    <Show when={FontStore.FontReporter} fallback={<div>加载字体报告中。。。</div>}>
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
        </div>
    );
};

const FontHome = () => {
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
    return (
        <main class="my-4 flex w-screen  flex-1 flex-col">
            <header class="p-4 ">
                <header class="text-2xl">
                    {FontStore.fontName}
                    <IconLink></IconLink>
                </header>
                <div class="text-xs text-gray-600">
                    由于本站资源较多，故加载稍慢，请稍等。可以尝试刷新页面。
                </div>
                <div class="flex gap-4 py-2">
                    <A
                        href={'/fonts/' + FontStore.packageName}
                        class="rounded-lg bg-neutral-200 px-2 py-1 transition-colors duration-300"
                    >
                        返回
                    </A>
                    <For each={temp}>
                        {(item) => {
                            return (
                                <button
                                    class="rounded-lg bg-neutral-200 px-2 py-1 transition-colors duration-300"
                                    classList={{
                                        'bg-sky-600 text-white': isSelected(item.value),
                                    }}
                                    onclick={() => showingPanel(item.value)}
                                >
                                    {item.name}
                                </button>
                            );
                        }}
                    </For>
                </div>
            </header>
            <main class="flex  items-center justify-center overflow-y-auto">
                {isSelected('poetry') && <Poetry></Poetry>}
                {isSelected('white') && <BG class="bg-white text-black"></BG>}
                {isSelected('black') && <BG class="bg-black text-white"></BG>}
            </main>
        </main>
    );
};
const IconLink = () => {
    const temp = [
        {
            // Github
            link: `https://github.com/KonghaYao/chinese-free-web-font-storage/tree/branch/packages/${FontStore.packageName}/fonts`,
            icon: 'https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons/icons/folder_type_github.svg',
        },
        {
            // NPM
            link: `https://www.npmjs.com/package/@chinese-fonts/${FontStore.packageName}${
                FontStore.selectedVersion ? '/v/' + FontStore.selectedVersion : ''
            }`,
            icon: 'https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons/icons/file_type_npm.svg',
        },
    ];
    return (
        <span class="float-right flex gap-4">
            <For each={temp}>
                {(item) => {
                    return (
                        <a
                            href={item.link}
                            target="_blank"
                            class="overflow-hidden rounded-full bg-white  shadow-lg ring-amber-400 transition-all hover:ring"
                        >
                            <img class="h-12 w-12 " src={item.icon} alt="" />
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
        <div class={'mx-2  flex rounded-2xl p-8 px-8 sm:px-16 ' + props.class}>
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
        <div class="poetry">
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
