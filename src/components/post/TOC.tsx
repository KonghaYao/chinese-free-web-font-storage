import { createSignal, onMount } from 'solid-js';

export const TOC = (props: { selector: string }) => {
    const [toc, setToc] = createSignal<{ level: number; title: string | null; id: string }[]>([]);
    onMount(() => {
        const article = document.querySelector(props.selector)!;

        // 获取所有标题标签
        const headingTags = article.querySelectorAll('h1, h2, h3, h4, h5, h6');

        // 生成 toc 数组并返回
        const toc = Array.from(headingTags).map((heading) => ({
            level: Number(heading.tagName.slice(1)),
            title: heading.textContent,
            id: heading.id,
        }));
        setToc(toc);
    });

    return (
        <nav class="max-w-lg">
            <ul>
                {toc().map((i) => {
                    return (
                        <li>
                            <a href={'#' + i.id} class="line-clamp-1">
                                {i.title}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};
