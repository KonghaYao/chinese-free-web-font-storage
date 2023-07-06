---
title: 中文网络字体最佳实践
description: 这篇文章将会带你一起完成中文网络字体的落地优化，将中文字体带入你的网页中。
article:
    authors:
        - 江夏尧
    section: 性能优化
    tags:
        - 性能优化
    pubDate: 2023-5-23
    image: 'https://ik.imagekit.io/chinesefonts/tr:w-1200/image/photo-1508804185872-d7badad00f7d.jfif'
---

# 中文网络字体优化

这篇文章将会带你一起完成中文网络字体的落地优化，将中文字体带入你的网页中。

## 字体分包优化

字体分包使用 `@konghayao/cn-font-split` 可以轻松配置并分包，下面的优化也是采用这个插件进行优化的。

### 使用 woff2 格式的成品字体

`@konghayao/cn-font-split` 支持将输入字体分包为 woff2 格式，通过下面的配置即可完成。

```js
import { fontSplit } from '@konghayao/cn-font-split';
await fontSplit({
    FontPath: `./fonts/fonts.ttf`, // 插件会自动转化
    destFold: dest,
    targetType: 'woff2', // 配置 woff2
    chunkSize: 70 * 1024,
    testHTML: true,
    previewImage: {},
});
```

> 在现代字体中，WOFF2 是最新的字体格式，支持的浏览器最广，也提供了最好的压缩率。由于它使用 Brotli 算法，WOFF2 比 WOFF 格式的压缩效果提高了 30%，这意味着需要下载的数据更少，因此可以获得更快的性能表现。[字体使用最佳实践](https://web.dev/font-best-practices/#be-cautious-when-using-preload-to-load-fonts)

![woff2 支持情况](https://ik.imagekit.io/chinesefonts/image/woff2_support_status.png?updatedAt=1685674214183)

### 合理的字体分包切割大小

在切割字体时，建议将字体切割为 70KB 大小一份，适合于网络情况较一般的情况。当字体分片过大时，会导致服务器响应时间过长，而且分片的字符命中率也可能较低。在 70KB 分包时，加载时间大致在 1.5 秒左右，完全加载也不会超过 2 秒中，所以不用担心速度问题。

![加载时间图](https://ik.imagekit.io/chinesefonts/image/performance_states.png?updatedAt=1685672192849)

## 字体下载优化

### 使用支持高并发的 CDN 服务！！！

中文字体能够快速、稳定加载的基础是支持高并发的 CDN 服务。中文字体分片非常多，单一页面在加载时并发数非常高，如果 CDN 服务不支持高并发，则会导致页面卡顿问题。

![高并发下载](https://ik.imagekit.io/chinesefonts/image/performance_states.png?updatedAt=1685672192849)

### 采用高级 HTTP 协议、合理使用缓存头部

[HTTP/2 协议和 HTTP/3 协议](https://web.dev/content-delivery-networks/#http2-and-http3) 都能够促使浏览器并发下载文件，极大地加速字体下载过程，建议开启。

对于字体分包文件夹，CDN 文件缓存可以设置为永久缓存。这样可以使得用户只需加载一次字体，再次进入页面时均使用浏览器缓存。由于打包成品字体分片使用了哈希名称，故不用担心更换字体导致的缓存不更新问题。

> 注意：CSS 文件设置合理的缓存时间，因为 CSS 文件是索引文件，如果发生字体更新的情况，那么用户有可能还在缓存状态。（如果肯定不会更改，那么可以无视这一项）

![缓存头部设置](https://ik.imagekit.io/chinesefonts/image/status_cache.png?updatedAt=1685672427892)

## 前端代码优化

### Preconnect 预链接

一般来说，CDN 都与主站分离，主站通过跨域获取到 CDN 站点的资源。在 HTML 中使用 `preconnect` 可以提前促使浏览器与你的 CDN 进行连接，这样需要下载字体的时候，可以节省一部分时间。

```html
<head>
    <link rel="preconnect" href="https://fonts.com" crossorigin />
</head>
```

#### ❗ 禁止使用 Preload 预下载 CSS 文件

Preload 预下载会全量下载对应文件，这样会导致字体按需下载失效。但是你可以预加载几个常用的字体文件分片，这个需要你手动去判断加载，流程较为复杂。

> 作为一种字体加载策略，使用预加载（preload）也需要谨慎使用，因为它会绕过某些浏览器内置的内容协商策略。例如，预加载会忽略“unicode-range”声明，如果明智地使用，应该只用于加载单个字体格式。 [字体使用最佳实践](https://web.dev/font-best-practices/)

## 扩展阅读

https://web.dev/font-best-practices/

https://web.dev/reduce-webfont-size

https://web.dev/optimize-webfont-loading/
