import { JSX, splitProps } from 'solid-js';
import { isServer } from 'solid-js/web';

interface AProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    lang?: string;
}

/**
 * Solid.js 链接组件，自动为本地路径添加语言前缀
 * @param props.lang 当前语言 (可选，默认从 URL 路径自动获取)
 * @param props.href 链接路径 (如 '/cdn/')
 */
export const A = (props: AProps) => {
    const [local, others] = splitProps(props, ['href', 'lang', 'children']);

    const getLang = () => {
        if (local.lang) return local.lang;
        if (isServer) return 'zh-cn'; // 服务端回退默认值
        // 从 URL 路径获取第一个段作为语言 (例如 /en/cdn/ -> en)
        return window.location.pathname.split('/')[1] || 'zh-cn';
    };

    const getHref = () => {
        const href = local.href || '';
        const currentLang = getLang();

        // 如果是外部链接、锚点或已包含语言前缀，则直接返回
        if (
            href.startsWith('http') ||
            href.startsWith('#') ||
            href.startsWith(`/${currentLang}/`) ||
            href === `/${currentLang}`
        ) {
            return href;
        }

        // 补全前缀
        const cleanPath = href.startsWith('/') ? href : `/${href}`;
        return `/${currentLang}${cleanPath}`;
    };

    return (
        <a {...others} href={getHref()}>
            {local.children}
        </a>
    );
};
