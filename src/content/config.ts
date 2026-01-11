import { defineCollection, z } from 'astro:content';

const post = defineCollection({
    // Type-check frontmatter using a schema
    schema: z.object({
        title: z.string(),
        description: z.string().optional().nullish(),
        keywords: z.string().optional(),
        article: z.object({
            authors: z.union([z.string(), z.array(z.string())]),
            pubDate: z.coerce.date(),
            section: z.string().optional(),
        }),
    }),
});

export const collections = { post };
