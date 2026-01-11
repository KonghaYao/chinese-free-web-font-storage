import { Component } from 'solid-js';
import { isServer } from 'solid-js/web';

export interface MarkdownComponent {
    default: Component;
    frontmatter: any;
    toc: any[];
}

const allContents = import.meta.glob<boolean, string, MarkdownComponent>('~/content/post/**/*.md');
export const getSections = (lang: string) => {
    return new Map(
        [...Object.entries(allContents)].filter(([key, val]) => {
            return key.includes('/post/' + lang + '/');
        })
    );
};

/** 在服务器端获取所有的md文件 */
export const getArticlesInServer = async (lang: string) => {
    const entries = await Promise.all(
        [...Object.entries(allContents)]
            .filter(([key, val]) => {
                return key.includes('/post/' + lang + '/');
            })
            .map(async ([key, v]) => {
                return {
                    key,
                    ...(await v()),
                    path: `/post/${key.split(`/${lang}/`)[1].replace(/\.mdx?/, '')}`,
                    lang,
                };
            })
    );
    return entries.sort((a, b) => {
        return (
            new Date(a.frontmatter?.article?.pubDate).getTime() -
            new Date(b.frontmatter?.article?.pubDate).getTime()
        );
    });
};
export const getArticleComponent = (lang: string, slug: string) => {
    return import(`~/content/post/${lang}/${slug}.md`);
};
