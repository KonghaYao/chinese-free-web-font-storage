import { CollectionEntry, getCollection } from 'astro:content';

export const posts = await getCollection('post');

export const sections = new Map<string, CollectionEntry<'post'>[]>();
posts.forEach((i) => {
    const tag = i.data.article.section;
    if (sections.has(tag)) {
        sections.get(tag)!.push(i);
    } else {
        sections.set(tag, [i]);
    }
});
