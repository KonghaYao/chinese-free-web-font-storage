// @i18n-disable
import i18n from 'i18next';
import { createContext, createMemo, mergeProps, useContext } from 'solid-js';
import { isServer } from 'solid-js/web';
import { A } from './A';

const createI18n = async (key: string, packages: () => Promise<any>) => {
    const i = i18n.createInstance();

    await i.init(
        {
            // 设置默认语言
            lng: key,
            fallbackLng: key,
            // 是否启用调试模式
            debug: false,
            resources: {
                [key]: { translation: (await packages()).default },
            },
            lowerCaseLng: true,
        },
        function (err, t) {
            if (err) throw err;
            // i18n插件初始化完成或异常时的回调函数
            console.info(key, '初始化完成');
        }
    );
    return i;
};
export * from 'i18next';

interface LanguageConfig {
    lang: string;
    name: string;
    translation: () => Promise<any>;
}

class LanguageServer extends Map {
    constructor(public languages: LanguageConfig[]) {
        super();
    }
    async init(
        /** 客户端当前的语言 */
        lang: string
    ) {
        if (isServer) {
            // 服务端运行需要配置所有语言包
            for (const config of this.languages) {
                await this.registerLanguage(config);
            }
        } else {
            // 而前端只需要配置当前语言包
            await this.loadSingleLanguage(lang);
        }
    }
    async loadSingleLanguage(lang: string) {
        const config = this.languages.find((i) => i.lang === lang);
        if (!config) return console.warn(`load Language (${lang}) failed`);
        await this.registerLanguage(config);
    }
    async registerLanguage(lang: LanguageConfig) {
        if (this.has(lang.lang)) return;
        const instance = await createI18n(lang.lang, lang.translation);
        this.set(lang.lang, instance);
    }
    getInstance(lang: string) {
        return this.get(lang) ?? this.values().next().value;
    }
}

const languageConfig = new LanguageServer([
    {
        lang: 'zh-cn',
        name: '简体中文',
        translation: () => import('./i18n/zh-cn.json'),
    },
    {
        lang: 'en',
        name: 'English',
        translation: () => import('./i18n/en.json'),
    },
] as const);

// 在 Astro 中，由于是顶层 await，我们需要确保环境正确
const getInitialLang = () => {
    if (isServer) return 'zh-cn';
    return location.pathname.split('/')[1] || 'zh-cn';
};

const defaultLanguage = getInitialLang();
// if (isServer) {
await languageConfig.init(defaultLanguage);
// }
export const getLangFromURL = (url: string) => {
    if (!url) return;
    return new URL(url).href?.split('/')?.[1];
};

export const $t = (str: string, ...args: any) => {
    let lang = getLangFromURL(globalThis.location?.toString()) ?? defaultLanguage;
    let instance = languageConfig.getInstance(lang);
    /** @ts-ignore */
    return instance?.t(str, ...args) ?? str; // 防止切换时导致 BUG
};

export const watchLanguageRouter = () => {
    return createMemo(() => {
        if (isServer) return { lang: 'zh-cn' };
        return { lang: window.location.pathname.split('/')[1] || 'zh-cn' };
    });
};

export { languageConfig };
export { A };
