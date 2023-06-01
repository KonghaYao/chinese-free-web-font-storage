import { atom } from '@cn-ui/use';
import { Component, createSelector, For } from 'solid-js';
import type { DetailContextType } from './DetailContext';

export const WordWall: Component<{ class: string }> = (props) => {
    const text =
        '景建传积寸严尽清川止诚基而德谷恶宝曰则温盛容初所仕去圣空因非君忠兴之映笃业登棠赞作正祸璧事力夙松取定荣优甘诗念表听尺父竭薄如安令学以克端习庆资当履渊辞宜竞存丝贤形堂善竞孝深斯息言终无政悲维立虚缘是敬临兰不思慎甚从墨行名声福阴与命似流若美籍取';
    return (
        <div
            style="letter-spacing: 0.2rem;"
            class={'  w-fit items-center rounded-2xl p-8 px-8 sm:px-16 ' + props.class}
        >
            <span class="float-left text-9xl">永</span>
            <span class="float-left text-7xl">远</span>
            <span class=" h-fit text-lg">{text}</span>
        </div>
    );
};
