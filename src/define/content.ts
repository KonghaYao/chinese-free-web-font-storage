import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
    schema: z.object({
        title: z.string(),
        description: z.string(),
        article: z.object({
            tags: z.array(z.string()),
            author: z.array(z.string()),
            pubDate: z.string().transform((str) => new Date(str)),
            image: z.string(),
        }),
    }),
});

export const collections = { blog };
