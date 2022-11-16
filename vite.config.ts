/// <reference types="vitest" />
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import p from './package.json';
import visualizer from 'rollup-plugin-visualizer';
import fs from 'fs';
export default defineConfig(({ mode }) => {
    const __isDev__ = mode === 'development';
    return {
        base: './',
        plugins: [
            solidPlugin(),
            {
                enforce: 'pre',
                transformIndexHtml(code) {
                    // 替换 HTML 中的模板位置为搜索引擎的东西
                    if (!__isDev__)
                        return code.replace(
                            '<!-- Info Inject -->',
                            fs.readFileSync('./html/searchEngine.html', 'utf8')
                        );
                },
            },
            mode === 'analyze' &&
                (visualizer({ open: true, filename: 'visualizer/stat.html' }) as any),
        ],

        resolve: {
            alias: {},
        },
        define: {
            __version__: JSON.stringify(p.version),
            __isDev__: JSON.stringify(__isDev__),
        },
        optimizeDeps: {
            include: [],
            exclude: ['@cn-ui/core'],
        },
        build: {
            rollupOptions: {
                input: {
                    index: './index.html',
                },
            },
        },
    };
});
