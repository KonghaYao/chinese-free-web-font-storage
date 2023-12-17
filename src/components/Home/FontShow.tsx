import { DebounceAtom, ThrottleAtom, atom, reflect } from '@cn-ui/reactive';
import { onMount } from 'solid-js';
import { __CDN__ } from '../../global';

export const FontShow = () => {
    const originFont = atom({
        url: __CDN__ + '/packages/jxzk/dist/江西拙楷/result.css',
        style: 'font-family:jiangxizhuokai',
    });
    const font = ThrottleAtom(originFont, 1000);
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
            <div class="text-sky-500">鼠标移动到左侧按钮，即可预览字体样式</div>
            <div class="my-6 text-6xl" style={'line-height:1.3;'} contentEditable>
                {text.split('').map((i) => {
                    if (i === '\n') return <br />;
                    return <span>{i}</span>;
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
