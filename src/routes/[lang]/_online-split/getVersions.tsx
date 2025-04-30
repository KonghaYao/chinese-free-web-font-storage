import { atom } from '@cn-ui/reactive';
import { Notice } from '~/Notice';

export const PluginVersion = atom('');
// 转为异步加载，防止文件发生阻塞
let roots = [
    'https://cdn.jsdelivr.net/npm/cn-font-split',
    // 'https://cdn.jsdelivr.net/npm/cn-font-split',
];
export const preload = () => {
    /** 24h 小时更新一次的链接，保证版本更新正确 */
    const scriptLink =
        roots[0] +
        (PluginVersion() ? '@' + PluginVersion() : '') +
        '/dist/cn-font-split.browser.js?t=' +
        (Date.now() / (24 * 60 * 60 * 1000)).toFixed(0);
    return import(/* @vite-ignore */ scriptLink)
        .then((res) => {
            const { fontSplit, Assets } = res as Awaited<typeof import('cn-font-split')>;
            // 注册在线地址
            Assets.pathTransform = (innerPath: string) =>
                innerPath.replace('./', roots[0] + '/dist/');
            // 获取版本号信息
            fetch(scriptLink, { cache: 'force-cache' }).then((res) => {
                PluginVersion(res.headers.get('X-Jsd-Version')!);
            });
            return fontSplit;
        })
        .catch((e) => {
            console.error(e);
            Notice.error(e as Error);
        });
};
/** 加载测试文件 */
export const getTestingFile = () => {
    return fetch(
        'https://cdn.jsdelivr.net/gh/KonghaYao/cn-font-split/packages/demo/public/SmileySans-Oblique.ttf'
    )
        .then((res) => res.blob())
        .then((res) => new File([res], 'SmileySans-Oblique.ttf'));
};
