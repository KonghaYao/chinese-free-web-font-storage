---
title: 中文字体使用指南
description: 如何在你的项目中使用中文网字计划提供的字体。
article:
    authors:
        - 江夏尧
    section: 使用教程
    tags:
        - 使用指南
    pubDate: 2023-5-31
    image: 'https://ik.imagekit.io/chinesefonts/tr:w-1200/image/photo-1508804185872-d7badad00f7d.jfif'
---

# 🧭 中文字体使用指南

> 下面的使用方法默认您已经学习了基础的 HTML 和 CSS 基础，对于网站开发有一定的了解。

## CDN 使用方式（推荐）

### 🔗 获取中文字体链接

中文网字计划提供了许多可以在线使用的字体，如果你不想花费力气在分包上传字体上，我们可以直接使用已经部署好的链接。

这个中文字体必须在远程服务器上提供服务，这样我们的网站才能够使用到这些字体。整个字体分包文件夹的主文件为 `result.css`，内部通过链接指向许多字体分包，通过这种方式将整个字体联合在一起。

![](https://ik.imagekit.io/chinesefonts/image/how_to_get_web_font_link.png?updatedAt=1685500819792)

> 🔔 很多情况下，我们需要自己部署字体分包到 CDN 中，这样可以使用更好的服务。在这里推荐您使用 [在线字体分包器](https://online-font-split.netlify.app) 分包并下载成果文件，最后手动上传到 CDN 中获取链接。

### 在网页中加入样式

在网页中加入推荐的 CSS 文件，然后你可以通过 CSS 选择器来选择指定的元素添加字体，使得中文字体渲染只在一个限定的范围内生效。

![](https://ik.imagekit.io/chinesefonts/image/how_to_add_css_style_for_webfont.png?updatedAt=1685501397200)

```html
<!-- 导入刚刚获取的 CDN 链接 -->
<link
    href="https://ik.imagekit.io/chinesefonts/packages/mkzyt/dist/猫啃珠圆体/result.css"
    rel="stylesheet"
/>
```

```css
/* 这里只向 article 加入字体 */
article {
    /* 字体的名称可以在 CSS 文件中看到或者在字体的主页查看 */
    font-family: 'MaokenZhuyuanTi';
    font-weight: 'normal';
}
```

## 前端项目嵌入中文字体

> ❗ 注意，你可以使用 NPM 直接使用字体，但是我并不推荐你这样使用。中文字体需要大并发和高效缓存，不适合与前端项目写在一块。如果你的网站是纯静态网页，并且将整个项目覆盖在 CDN 之下，那么可以使用这种方式部署。

### 从 NPM 中导入字体

在 NPM 中搜索 @chinese-fonts , 你可以看到很多的字体，但是只有编号标识。

你也可以在首页中查看 NPM 下载方式，然后再进行下载。

```sh
npm install @chinese-fonts/lxgwwenkai
```

在你的项目的文件中导入 css 文件。

```ts
import '@chinese-fonts/lxgwwenkai/dist/LXGWWenKai-Bold/result.css';
```

然后在 CSS 中添加渲染区域

```css
/* 这里只向 article 加入字体 */
article {
    /* 字体的名称可以在 CSS 文件中看到或者在字体的主页查看 */
    font-family: 'LXGW WenKai';
    font-weight: 'bold';
}
```

## 字体是如何加载到浏览器的？

1. 在 HTML 文件中添加字体 CSS 索引文件，该文件大小约为 30~50KB。

2. 浏览器解析 HTML 文本时，会识别字符集区间并发起对相应字体文件的请求，这个过程是按需加载的，不会对下载速度造成太大影响。

3. CDN 服务将字体分包返回给浏览器，由于此过程是并发的，因此下载速度非常快。

4. 浏览器会将下载的字体文件缓存起来，以便后续页面中使用相同字体时直接使用缓存的字体文件，避免重新下载，提高效率。

5. 当字体分包文件返回到浏览器时，浏览器会自动渲染对应的区域，因此字体渲染是部分渲染直至完成的。
