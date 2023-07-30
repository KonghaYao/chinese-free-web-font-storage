---
title: 字体分包部署与使用
description: 如何部署使用分包完成的字体。
article:
    authors:
        - 江夏尧
    section: 使用教程
    tags:
        - 使用指南
    pubDate: 2023-7-16
    image: ''
---

# 字体分包部署与使用

> 由于中文网字计划的 CDN 被多个平台盗用，故未来将缩减提供公共 CDN 链接的相应流量，并且不再保证链接稳定性。所以各位开发者需要自行将字体部署至 CDN 中，为各位的网页加速。

## 获取分包后的文件夹

一个字体在经过 [**在线字体分包**](/online-split) 或者 **代码工具分包** 后，会得到成品文件夹，里面包含了细分 woff2 文件、CSS 索引文件、reporter.json 等数据文件。这些文件需要部署到 OSS 中才能发布到网络上，而 CDN 能够缓存这些文件，并优化加速用户端的下载情况，然后在您的前端项目中引用 CSS 链接即可使用。

## 部署到 ImageKit OSS

由于 OSS 文件上传大同小异，我们选择有免费额度的 [ImageKit](https://imagekit.io/) 进行教学。ImageKit 本身自带了一套 CDN，但是额度只有 20G/月，对于中小型网站可以直接使用其链接。

注册完成之后，根据下图可以直接上传整个文件夹（注意保存到合适的位置）。

![image_folder_upload_guide](/assets/image_folder_upload_guide.png)

上传完成之后，找到你的 CSS 文件，并右键复制链接留以待用。文件可能有点多，如果你嫌麻烦，可以复制同文件夹的文件路径，然后修改文件名为 `result.css`

![how_to_get_image_url](/assets/how_to_get_image_url.png)

## 通过 CDN 加速 OSS 中的文件

CDN 的作用是在全球的多个服务器上设置文件缓存，保证离用户最近的点能够快速响应静态文件。通过 CDN 将 OSS 包裹一层，既可以减少对 OSS 下载压力，也可以获得边缘数据加速的功能。在这里，我们也使用有免费额度的 [LightCDN](https://www.lightcdn.com/) 进行演示。

首先注册一个 LightCDN 账号，然后设置你的 CDN 配置项，如下图填写。

![lightCDN_init](/assets/lightCDN_init.png)

你的 CDN 就配置好了，通过 CDN 提供的 URL 转换一下你的字体 CSS 文件的 URL 即可。（其实就是把域名给替换成为 LightCDN 给你的 CDN 域名 😂)

```diff
-https://ik.imagekit.io/chinesefonts1/packages/jxzk/dist/江西拙楷/result.css
+https://901557678.r.cdn36.com/chinesefonts1/packages/jxzk/dist/江西拙楷/result.css
```

### 高级设置

1. 更改 CDN 服务器位置为下图

![cdn_area_setting](/assets/cdn_area_setting.png)

## 在网页中加载 CSS 文件

1. 导入 CSS 文件，link 标签或者 css import 皆可以。 可以添加一个 preconnect 来加速你的链接

```html
<link rel="preconnect" href="https://901557678.r.cdn36.com/" crossorigin />
<link
    href="https://901557678.r.cdn36.com/chinesefonts1/packages/jxzk/dist/江西拙楷/result.css"
    rel="stylesheet"
/>
```

1. 构建一个 CSS 类名使用字体名称

```css
.use-my-font {
    font-family: 'Name'; // 这个名称你需要到`result.css`文件中查看
}
```
