import { createSignal, onMount } from 'solid-js';

export const TOC = (props: { selector: string; class?: string }) => {
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
        <ul class={props.class}>
            {toc().map((i) => {
                return (
                    <li
                        class={
                            'toc-item line-clamp-1 cursor-pointer rounded-md hover:bg-neutral-200 ' +
                            ' article-level-' +
                            i.level
                        }
                        title={i.title!}
                        onclick={(e) => {
                            // 使用 js 控制可以避免布局导致滚动条非 body 而移动 section
                            const dom = document.getElementById(i.id);
                            dom?.scrollIntoView({
                                block: 'nearest',
                            });
                        }}
                    >
                        {i.title}
                    </li>
                );
            })}
        </ul>
    );
};
