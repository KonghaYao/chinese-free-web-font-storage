import { ThrottleAtom, atom } from '@cn-ui/reactive';
import { createEffect, onMount } from 'solid-js';
import { __CDN__ } from '../../global';
import anime from 'animejs';
const showAnime = () => {
    return anime({
        targets: '.showing-text span',
        translateY: [150, 0],
        opacity: [0, 1],
        easing: 'spring(1, 80, 10, 0)',
        duration: 300,
        delay: anime.stagger(100), // increase delay by 100ms for each elements.
    });
};
console.log(anime);
export const FontShow = () => {
    const originFont = atom({
        url: __CDN__ + '/packages/jxzk/dist/江西拙楷/result.css',
        style: 'font-family:jiangxizhuokai',
    });
    const font = ThrottleAtom(originFont, 2000);
    createEffect(() => {
        font();
        showAnime();
    });
    const text = '中文网字计划\n带来网络\n中文的爱与和谐';
    onMount(() => {
        [...document.querySelectorAll<HTMLAnchorElement>('.display-font-show-hover')].forEach(
            (dom) => {
                dom.addEventListener('mouseover', (i) => {
                    originFont(() => ({ url: dom.dataset.src!, style: dom.dataset.style! }));
                });
            }
        );
    });
    return (
        <div class="flex select-text flex-col justify-center " style={font().style}>
            <div class="text-sky-500">鼠标移动到右侧字体，即可预览字体样式</div>
            <div class="showing-text my-6 text-6xl" style={'line-height:1.3;'} contentEditable>
                {text.split('').map((i) => {
                    if (i === '\n') return <br />;
                    return <span class="inline-block">{i}</span>;
                })}
            </div>
            <div class="text-purple-600">如果你喜欢这款字体，可以点击进入详情页</div>
            <div class="text-gray-600">你甚至可以直接编辑它！</div>
            <link rel="stylesheet" href={font().url} />

            <a
                href="https://github.com/KonghaYao/chinese-free-web-font-storage"
                class="text-rose-600"
            >
                江夏尧 ｜ 如果你喜欢，请给我点个 star{' '}
            </a>
        </div>
    );
};
