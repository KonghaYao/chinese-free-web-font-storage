import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import solidJs from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import robotsTxt from 'astro-robots-txt';

import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  site: 'https://chinese-font.netlify.app',
  integrations: [sitemap(), solidJs(), tailwind(), robotsTxt(), compress()],
  // output: 'server',
  output: 'static'
});