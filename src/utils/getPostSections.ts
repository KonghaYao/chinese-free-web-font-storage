import { CollectionEntry, getCollection } from 'astro:content';

export const posts = await getCollection('post');

/** 获取所有篇章 */
export const sections = new Map<string, CollectionEntry<'post'>[]>();
posts.forEach((i) => {
    const tag = i.data.article.section;
    if (sections.has(tag)) {
        sections.get(tag)!.push(i);
    } else {
        sections.set(tag, [i]);
    }
});

/** 获取当篇的上下篇的函数 */
export const getPostSection = (slug: string) => {
    let prev: CollectionEntry<'post'> | null = null;
    let next: CollectionEntry<'post'> | null = null;
    let target: CollectionEntry<'post'> | null = null;

    let alreadyGet = false;
    for (const [_, posts] of [...sections.entries()]) {
        for (const post of posts) {
            if (alreadyGet) {
                next = post;
                break;
            } else if (slug === post.slug) {
                target = post;
                alreadyGet = true;
            } else {
                prev = post;
            }
        }
        if (alreadyGet && next) break;
    }
    return { target, next, prev };
};
