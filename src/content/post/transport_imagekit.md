---
title: 转接 ImageKit 服务器
description: 转接 ImageKit 服务器
article:
    authors:
        - 江夏尧
    section: 使用教程
    tags:
        - 使用指南
    pubDate: 2023-12-24
    image: 'https://ik.imagekit.io/chinesefonts/tr:w-1200/image/photo-1508804185872-d7badad00f7d.jfif'
---

# 转接 ImageKit 服务器

由于某些原因，我们可能需要转接一下 ImageKit 服务提供商的 CDN，使得我们的网站得到更快，更好的加载速度。这个时候，我们需要用免费的函数计算服务，将 Imagekit 提供的数据转换到另一个域名。

> 如果你是转接给 CDN 使用，那么完全没有问题；CDN 的缓存仅仅会少量访问你的中继服务器。但是如果是直接提供给你的网站使用，那么最好斟酌一下。

## 使用 deno.dev 转接

1. 使用你的 Github 账号登陆 [deno.dev](https://deno.dev)。

2. 创建一个 playground。（注意点击 New Playground 按钮，而不是 Project）

3. 你会进入到一个代码编辑器，复制下面的代码到编辑器（不用更改任何信息），保存。

    ```ts
    import { ConnInfo, serve } from 'https://deno.land/std@0.177.0/http/server.ts';

    /** 复制头部 */
    const copyHeaders = (headers: Headers) => {
        const newHeader = new Headers();
        for (let i of headers.entries()) {
            newHeader.append(...i);
        }
        return newHeader;
    };
    /** 重写请求头部信息 */
    const ReqHeadersRewrite = (req: Request, Url: URL) => {
        const newH = copyHeaders(req.headers);
        newH.delete('X-deno-transparent');
        // 重写 referer 和 origin 保证能够获取到数据
        newH.set('referer', Url.toString());
        newH.set('origin', Url.toString());
        return newH;
    };
    const ResHeadersReWrite = (res: Response, domain: string) => {
        const newHeader = copyHeaders(res.headers);
        newHeader.set('access-control-allow-origin', '*');
        const cookie = newHeader.get('set-cookie');
        cookie && newHeader.set('set-cookie', cookie.replace(/domain=(.+?);/, `domain=${domain};`));
        newHeader.delete('X-Frame-Options'); // 防止不准 iframe 嵌套
        return newHeader;
    };
    /** 代理整个网站，包括所有请求模式 */
    const proxy = (host: string, req: Request) => {
        // const Url = getTransparentURL(req);
        const Url = new URL(req.url);
        Url.host = host;
        if (Url instanceof Response) return Url;
        // console.log(Url.toString());

        const newH = ReqHeadersRewrite(req, Url);
        return fetch(Url, {
            headers: newH,
            method: req.method,
            // 所有 body 将会转交，故没啥兼容问题
            body: req.body,
            redirect: req.redirect,
        }).then((res) => {
            const newHeader = ResHeadersReWrite(res, new URL(req.url).host);
            const config = {
                status: res.status,
                statusText: res.statusText,
                headers: newHeader,
            };
            console.log(res.status, res.url);
            if (res.status >= 300 && res.status < 400) {
                console.log('重定向至', req.url);
                return Response.redirect(req.url, res.status);
            }
            return new Response(res.body, config);
        });
    };

    serve(
        (req: Request) => {
            return proxy('ik.imagekit.io', req);
        },
        {
            onError(e) {
                return new Response(JSON.stringify({ error: e, code: 101 }), {
                    headers: {
                        'access-control-allow-origin': '*',
                    },
                });
            },
        }
    );
    ```

4. 你在编辑器的右侧可以看见地址栏里面的 URL，这个就是你转接后的 URL 地址了。

5. 这个地址后面跟着的路径，与原先网站的路径相同，只不过域名变成了 deno.dev
