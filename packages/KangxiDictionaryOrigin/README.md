# 中文网字项目

[官网](https://chinese-font.netlify.app)

中文网字项目是用于将中文字体切割并放置在 NPM 进行快速部署的项目。

## 快速使用

这个项目其实就是一个 CSS 仓库，里面有包含字体文件在内的 CSS 文件，可以被外部 CDN 或者自己 `npm install` 一下进行使用。

**注：本字体「康熙字典体」是原籍扫描生成的字体，适合古籍排版使用，不支持简化字。**

### 使用 CDN

```html
<link
    href="https://unpkg.com/@chinese-fonts/Kangxi Dictionary Origin/dist/{具体的包名}/results.css"
    rel="stylesheet"
/>
```

### 在项目中使用

```sh
npm install @chinese-fonts/Kangxi Dictionary Origin
```

```ts
import "@chinese-fonts/Kangxi Dictionary Origin/dist/{具体的包名}/results.css";
```

## 字体许可

详见 [官网](https://chinese-font.netlify.app/fonts/Kangxi Dictionary Origin)
