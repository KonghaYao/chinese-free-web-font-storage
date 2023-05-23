import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import solidJs from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify/functions';
import robotsTxt from 'astro-robots-txt';

// https://astro.build/config
export default defineConfig({
    site: 'https://chinese-font.netlify.app',
    integrations: [sitemap(), solidJs(), tailwind(), robotsTxt()],
    output: 'server',
    adapter: netlify(),
});
