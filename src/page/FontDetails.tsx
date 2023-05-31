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
import type { DetailContextType } from './DetailContext';

export const FontDisplay = (props: DetailContextType) => {
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
        <section class="flex-1 place-content-center overflow-y-auto">
            <div class="flex  items-center gap-4 px-4  py-2 text-center">
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
            </div>
            <div class="flex flex-1 items-center justify-center">
                {isSelected('poetry') && <Poetry></Poetry>}
                {isSelected('white') && <BG class="bg-white text-black"></BG>}
                {isSelected('black') && <BG class="bg-black text-white"></BG>}
            </div>
        </section>
    );
};

const BG: Component<{ class: string }> = (props) => {
    const text =
        '景建传积寸严尽清川止诚基而德谷恶宝曰则温盛容初所仕去圣空因非君忠兴之映笃业登棠赞作正祸璧事力夙松取定荣优甘诗念表听尺父竭薄如安令学以克端习庆资当履渊辞宜竞存丝贤形堂善竞孝深斯息言终无政悲维立虚缘是敬临兰不思慎甚从墨行名声福阴与命似流若美籍取';
    return (
        <div
            style="letter-spacing: 0.2rem;"
            class={' flex w-fit items-center rounded-2xl p-8 px-8 sm:px-16 ' + props.class}
        >
            <div class="flex  flex-col justify-evenly pr-4  text-9xl sm:pr-8 ">
                <div>永</div>
                <div>远</div>
            </div>
            <div class=" h-fit text-lg">{text}</div>
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
