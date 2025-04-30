import type { APIEvent } from '@solidjs/start/server';
// 转接 deno 的 cdn 请求
export async function GET(event: APIEvent) {
    const url = event.request.url;
    const path = url.split('/font-cdn')[1];
    return fetch(`https://chinese-fonts-cdn.deno.dev${path}`, {
        headers: event.request.headers,
        redirect: 'manual',
    }).then(async (res) => {
        return res;
    });
}
