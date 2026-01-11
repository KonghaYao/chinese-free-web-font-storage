import { defineConfig } from 'astro/config';
import solidjs from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

import { remarkMdxToc } from 'remark-mdx-toc';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { remarkHeadId } from 'remark-head-id';
import Prism from 'remark-prism';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  output: 'server',

  integrations: [
      solidjs(),
      tailwind(),
      mdx({
          remarkPlugins: [
              remarkMdxToc,
              remarkFrontmatter,
              remarkMdxFrontmatter,
              remarkHeadId,
              Prism,
          ],
      }),
  ],

  vite: {
      build: {
          target: 'esnext',
      },
      resolve: {
          alias: {
              '~': '/src',
          },
      },
  },

  // Astro 4.0 原生 i18n 配置
  i18n: {
      defaultLocale: 'zh-cn',
      locales: ['zh-cn', 'en'],
      routing: {
          prefixDefaultLocale: true,
      },
  },

  adapter: netlify(),
});