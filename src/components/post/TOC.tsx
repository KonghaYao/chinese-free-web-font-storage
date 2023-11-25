import type { MarkdownHeading } from 'astro';

export const TOC = (props: { heading: MarkdownHeading[]; class?: string }) => {
    return (
        <ul class={props.class}>
            {props.heading.map((i) => {
                return (
                    <a
                        class={
                            'toc-item line-clamp-1 cursor-pointer rounded-md text-gray-600 hover:bg-green-100 hover:text-green-700 ' +
                            ' article-level-' +
                            i.depth
                        }
                        href={'#' + i.slug!}
                        onclick={(e) => {
                            // 使用 js 控制可以避免布局导致滚动条非 body 而移动 section
                            const dom = document.getElementById(i.slug);
                            dom?.scrollIntoView({
                                block: 'nearest',
                            });
                        }}
                    >
                        {i.text}
                    </a>
                );
            })}
        </ul>
    );
};
