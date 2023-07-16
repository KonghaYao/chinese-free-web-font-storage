import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import solidJs from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import robotsTxt from 'astro-robots-txt';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import compress from 'astro-compress';
import { loadEnv } from 'vite';
const env = loadEnv(import.meta.env.MODE, process.cwd(), '');
// https://astro.build/config
export default defineConfig({
    site: 'https://chinese-font.netlify.app',

    integrations: [sitemap(), solidJs(), tailwind(), robotsTxt(), compress()],
    // output: 'server',
    output: 'static',
    experimental: {
        assets: true,
    },
    vite: {
        optimizeDeps: {
            exclude: ['@konghayao/cn-font-split'],
        },
        plugins: [
            import.meta.env.MODE === 'production' &&
                sentryVitePlugin({
                    org: 'chinese-font',
                    project: 'chinese-font-fe',
                    // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
                    // and need `project:releases` and `org:read` scopes
                    authToken: env.SENTRY_AUTH_TOKEN,
                    sourcemaps: {
                        // Specify the directory containing build artifacts
                        assets: './dist/**',
                        // Don't upload the source maps of dependencies
                        ignore: ['./node_modules/**'],
                    },
                    // Helps troubleshooting - set to false to make plugin less noisy
                    debug: true,
                }),
        ],
    },
    markdown: {
        shikiConfig: {
            // Choose from Shiki's built-in themes (or add your own)
            // https://github.com/shikijs/shiki/blob/main/docs/themes.md
            theme: 'github-dark-dimmed',
            // Enable word wrap to prevent horizontal scrolling
            wrap: true,
        },
    },
});
