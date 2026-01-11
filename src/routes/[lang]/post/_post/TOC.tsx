import { type TocEntry } from 'remark-mdx-toc';
import GitHubSlugger from 'github-slugger';

export const TOC = (props: { heading: TocEntry[]; class?: string; pIds: string[] }) => {
    const slugger = new GitHubSlugger();
    return (
        <ul class={props.class}>
            {props.heading.map((i, index, arr) => {
                if (!i.value) return;
                const id = slugger.slug(i.value);
                return (
                    <>
                        <a
                            class={
                                'toc-item line-clamp-1 cursor-pointer rounded-md text-gray-600 hover:bg-green-100 hover:text-green-700 ' +
                                ' article-level-' +
                                i.depth
                            }
                            href={'#' + id!}
                            onclick={(e) => {
                                e.preventDefault();
                                const p = [...props.pIds, id].filter(Boolean).reduce((dom, id) => {
                                    // 第一次直接获取 dom
                                    if (dom === document) return dom.getElementById(id);
                                    // 往 dom 后面找 id 为 id 的dom
                                    let next = dom;
                                    while (next && !next.id.startsWith(id)) {
                                        next = next.nextElementSibling;
                                    }
                                    if (next) return next;
                                    return dom;
                                }, document as any);
                                // 使用 js 控制可以避免布局导致滚动条非 body 而移动 section
                                if (!p) return;
                                p.classList.add('link-active');

                                location.hash = p.id;
                            }}
                        >
                            {i.value}
                        </a>
                        <TOC heading={i.children} pIds={[...props.pIds, id]}></TOC>
                    </>
                );
            })}
        </ul>
    );
};
