import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import solidJs from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';

import netlify from '@astrojs/netlify/functions';

// https://astro.build/config
export default defineConfig({
    site: 'https://chinese-font.netlify.app',
    integrations: [sitemap(), solidJs(), tailwind()],
    output: 'server',
    adapter: netlify(),
});
