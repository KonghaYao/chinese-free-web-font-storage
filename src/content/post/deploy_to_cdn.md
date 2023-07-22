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

一个字体在经过 [**在线字体分包**](/online-split) 或者 **代码工具分包** 后，会得到成品文件夹，里面包含了细分 woff2 文件、CSS 索引文件、reporter.json 等数据文件。这些文件需要部署到 CDN 中才能够获取一个公开的链接，然后在您的前端项目中引用 CSS 链接即可使用。

## 部署到 ImageKit CDN

由于 CDN 文件上传大同小异，我们选择有每月 20G 免费额度的 [ImageKit](https://imagekit.io/) 进行教学。

注册完成之后，根据下图可以直接上传整个文件夹（注意保存到合适的位置）。

![image_folder_upload_guide](/assets/image_folder_upload_guide.png)

上传完成之后，找到你的 CSS 文件，并右键复制链接留以待用。文件可能有点多，如果你嫌麻烦，可以复制同文件夹的文件路径，然后修改文件名为 `result.css`

![how_to_get_image_url](/assets/how_to_get_image_url.png)

## 在网页中加载 CSS 文件

1. 导入 CSS 文件，link 标签或者 css import 皆可以。
2. 构建一个 CSS 类名使用字体名称

```css
.use-my-font {
    font-family: 'Name'; // 这个名称你需要到`result.css`文件中查看
}
```
