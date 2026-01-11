import { classHelper } from '@cn-ui/reactive';
import { createResource } from 'solid-js';
import { codeToHtml } from 'shiki';

export const Code = (props: { class?: string; code: string; lang: string; theme?: string }) => {
    const [code] = createResource(
        () => ({ code: props.code, lang: props.lang, theme: props.theme }),
        async ({ code, lang, theme }) => {
            return codeToHtml(code, {
                lang: lang,
                theme: theme ?? 'vitesse-light',
            });
        }
    );
    return <div class={classHelper.base('overflow-auto')(props.class)} innerHTML={code() || ''}></div>;
};
export default Code;
