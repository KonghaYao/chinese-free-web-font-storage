import { defineConfig } from '@solidjs/start/config';
/* @ts-ignore */
import pkg from '@vinxi/plugin-mdx';
import font from 'vite-plugin-font';
import AutoImport from 'unplugin-auto-import/vite';
import { remarkMdxToc } from 'remark-mdx-toc';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { remarkHeadId } from 'remark-head-id';
/* @ts-ignore */
import Prism from 'remark-prism';
import { DynamicPublicDirectory } from 'vite-multiple-assets';
const { default: mdx } = pkg;

export default defineConfig({
    extensions: ['mdx', 'md', 'tsx', 'ts'],
    server: {
        preset: 'netlify',
        esbuild: {
            options: {
                target: 'esnext',
            },
        },
        prerender: {
            routes: ['/', '/cdn/', '/article/'].flatMap((i) =>
                ['zh-cn', 'en'].map((lang) => `/${lang}${i}`)
            ),
        },
    },
    middleware: "./src/middleware.ts",
    ssr: true,
    vite: {
        build: {
            target: 'esnext',
        },
        plugins: [
            AutoImport({
                include: [/\.[tj]sx?/],
                imports: [
                    {
                        '~/i18n': ['$t', 'A'],
                        '@solidjs/router': ['useParams', 'cache'],
                    },
                ],
                dts: './auto-imports.d.ts',
                viteOptimizeDeps: false,
            }),
            mdx.withImports({})({
                jsx: true,
                jsxImportSource: 'solid-js',
                providerImportSource: 'solid-mdx',
                remarkPlugins: [
                    remarkMdxToc,
                    remarkFrontmatter,
                    remarkMdxFrontmatter,
                    remarkHeadId,
                    Prism,
                ],
            }),
            font.vite({
                scanFiles: {
                    hot: ['./src/i18n/**/*.{md,mdx,ts,tsx,json}'],
                    post: ['./src/content/**/*.{md,mdx,ts,tsx}'],
                },
                css: {
                    comment: {
                        unicodes: true,
                    },
                },
            }),
            DynamicPublicDirectory(['public/**', '{\x01,assets}/**'], {
                ssr: true,
            }),
        ],
    },
});
