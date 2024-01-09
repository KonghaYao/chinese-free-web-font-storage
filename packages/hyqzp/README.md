# 中文网字项目

[官网](https://chinese-font.netlify.app/fonts/hyqzp)

中文网字项目是用于将中文字体切割并放置在 NPM 进行快速部署的项目。

## 快速使用

这个项目其实就是一个 CSS 仓库，里面有包含字体文件在内的 CSS 文件，可以被外部 CDN 或者自己 `npm install` 一下进行使用。

### 使用 CDN

```html
<link
    href="https://unpkg.com/@chinese-fonts/hyqzp/dist/{具体的包名}/results.css"
    rel="stylesheet" />
```

### 在项目中使用

```sh
npm install @chinese-fonts/hyqzp
```

```ts
import "@chinese-fonts/hyqzp/dist/{具体的包名}/results.css";
```

## 字体许可

详见 [官网](https://chinese-font.netlify.app/fonts/hyqzp)
