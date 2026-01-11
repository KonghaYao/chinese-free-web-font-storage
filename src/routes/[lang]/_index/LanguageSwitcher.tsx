import { Popover } from '@cn-ui/core';
import { classHelper } from '@cn-ui/reactive';
import { useContext, createMemo } from 'solid-js';
import { i18nContext, languageConfig } from '~/i18n';
export const LanguageSwitcher = ({ lang }: { lang: string }) => {
    const config = languageConfig.languages;

    // 使用 createMemo 监听并解析当前路径
    const pathname = createMemo(() =>
        typeof window !== 'undefined' ? window.location.pathname : ''
    );

    const LanguagesList = (props: { class?: string }) => {
        return (
            <nav
                class={classHelper.base(
                    'outline-none flex flex-col bg-gray-50 border rounded-2xl gap-4 p-4',
                    props.class
                )()}
            >
                {config.map((i) => {
                    const href = createMemo(() => {
                        const parts = pathname().split('/').filter(Boolean);
                        // 假设路径格式为 /[lang]/...
                        const rest = parts.slice(1).join('/');
                        return `/${i.lang}/${rest}`;
                    });

                    return (
                        <a
                            classList={{
                                selected: lang === i.lang,
                            }}
                            href={href()}
                        >
                            {i.name}
                        </a>
                    );
                })}
            </nav>
        );
    };
    return (
        <Popover trigger="hover" content={<LanguagesList></LanguagesList>}>
            <div class="flex items-center">
                {/* MdiTranslate Icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mr-1"
                    width="1.2em"
                    height="1.2em"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="currentColor"
                        d="m12.87 15.07l-2.54-2.51l.03-.03A17.5 17.5 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5l3.11 3.11zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2zm-2.62 7l1.62-4.33L19.12 17z"
                    />
                </svg>
                {config.find((i) => i.lang === lang)?.name || ''}
                {/* SEO 优化，保证能够被爬取到 */}
                <LanguagesList class="hidden"></LanguagesList>
            </div>
        </Popover>
    );
};
