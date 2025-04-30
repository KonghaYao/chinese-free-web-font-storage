import type { APIEvent } from '@solidjs/start/server';
// 转接 deno 的 cdn 请求
export async function GET(event: APIEvent) {
    const url = event.request.url;
    const path = url.split('/font-cdn')[1];
    console.log(path);
    return fetch(`https://chinese-fonts-cdn.deno.dev${path}`, {
        headers: event.request.headers,
    }).then(async (res) => {
        const text = await res.text();
        const headers = new Headers(res.headers);
        headers.delete('content-encoding');
        headers.delete('content-length');
        headers.set('content-type', 'text/css; charset=utf-8');
        return new Response(text, {
            headers,
        });
    });
}
