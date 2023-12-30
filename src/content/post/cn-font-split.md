---
title: cn-font-split 使用指南
description:
article:
    authors:
        - 江夏尧
    section: 使用教程
    tags:
        - 使用指南
    pubDate: 2023-12-30
    image: 'https://ik.imagekit.io/chinesefonts/tr:w-1200/image/photo-1508804185872-d7badad00f7d.jfif'
---

# cn-font-split 使用指南

cn-font-split 是中文网字计划实现中文字体网络部署的关键，其将庞大的中文字体包分成了易于部署、按需加载的小份包，从而创建高度可用的网络字体解决方案。

cn-font-split 拥有非凡的跨平台能力，其可以运行在 Nodejs 环境、Bun 环境、Deno 环境、命令行，甚至是浏览器环境，而且使用方式统一而且简单！

> 由于 Javascript 运行时的语法大同小异，下面会使用 Nodejs 环境的代码作为示例。

## Nodejs 的简单使用

1. 安装 cn-font-split

```sh
npm i @konghayao/cn-font-split
npm i cn-font-split # or
```

2. 写一份 JS 脚本

```js
// index.mjs
import fs from 'fs-extra';
import { fontSplit } from '../dist/index.js';
fontSplit({
    // 这是打包后的目录
    destFold: './temp/node',
    // 这个是原始字体包
    FontPath: '../demo/public/SmileySans-Oblique.ttf',
});
```

3. 启动脚本即可

```sh
node index.mjs
```

### 生成字体产物介绍

1. result.css
    1. 入口 css 文件，前端代码直接引用它即可
2. woff2 字体
    1. 核心产物，经过 cn-font-split 优化的字体分包
3. index.html
    1. 测试的 html 文件，默认生成
    2. 早期用于测试的网页文件，可以通过端口看到整个包的分包后效果
4. preview.svg
    1. 测试的字体图片，默认生成
    2. 你可以通过这个图片简单知道字体是什么样子的
5. reporter.json
    1. cn-font-split 的报告文件
    2. 其中包含 woff2 的分析和引用数据

### 自定义配置属性

生成产物的关键操作都可以通过相应的配置属性实现，下面结合具体需要进行一些示例。

1. 强制只分包某些字符

cn-font-split 的默认行为是自动分完字体内部的所有字符。但是特殊情况下，你想要只分包一定的字符也是可以的。

```js
{
    // 关闭自动分包，那么只会打包你 subsets 中指定的字符
    autoChunk: false,

    // 强制分包，优先于自动分包
    subsets: [
        // 这个是单独一个包，只包含 unicode 为 31105 和 8413 的字符
        [31105, 8413]
    ],
}
```

当然，我们一般都会采用字符串而不是 unicode 字符这种方式操作，那么使用下面的方式比较合适。

```js
{
    subsets: [
        '中文网字计划'
            .split('')
            .filter(Boolean)
            .map((i) => i.charCodeAt(0))
    ],
}
```

2. 控制生成的 CSS 文件

```js
{
    css: {
        // 更改 css 内部引用的字体名称
        fontFamily: '823746343',

        // 部分情况不需要 fontWeight
        fontWeight: false

        // 不进行本地字符声明
        localFamily: false,

        // 不生成注释
        comment: false,
        // comment: {
        //     base: false,
        //     nameTable: false,
        //     unicodes: true
        // }
    },
}
```

3. 更改打包后产物的命名

> 感谢 [richex-cn](https://github.com/richex-cn) 提供的帮助

```js
{
    renameOutputFont: '[hash:10][ext]', // 自动截断 hash 位数
    renameOutputFont: '[index][ext]', // 使用序号，而不是 hash
    // 自己实现命名
    renameOutputFont({ transferred, ext, index }) {
        const algorithm = 'sha256'
        const hash = crypto.createHash(algorithm).update(transferred).digest('hex')
        // return index.toString() + ext // index 命名
        return hash.slice(0, 6) + ext // 短 hash 命名
    }
}
```

4. 自定义打包的测试图片

```js
{
    previewImage: {
        /** 图中需要显示的文本 */
        text: '优秀的中文字体';
        /** 预览图的文件名，不用带后缀名 */
        name: '示例';
    },
    // 不生成
    // previewImage: false
}
```
