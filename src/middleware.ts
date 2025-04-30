import { createMiddleware } from '@solidjs/start/middleware';
import { languageConfig } from './i18n';
import { redirect } from '@solidjs/router';

export default createMiddleware({
    onRequest: [
        (event) => {
            const url = new URL(event.request.url);
            const lang = url.pathname.split('/')[1];
            const whiteList = ['/font-list.json', '/font-cdn'];
            if (
                !languageConfig.languages.find((i) => i.lang === lang) &&
                !whiteList.some((i) => url.pathname.startsWith(i))
            ) {
                return redirect('/zh-cn' + url.pathname, 301);
            }
        },
    ],
});
