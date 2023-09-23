---
title: 【工具设计】cn-font-split 的运行原理
description:
article:
    authors:
        - 江夏尧
    section: 技术内幕
    tags:
        - 设计流程
    pubDate: 2023-7-16
    image: ''
---

# 【工具设计】cn-font-split 的运行原理

cn-font-split 是中文网字计划的字体打包插件，能够运行在 Nodejs、Deno、浏览器中，帮助开发者打包字体文件。

## cn-font-split 的运行环境

cn-font-split 的源代码是 Typescript，使用 npm 链接起了 C++ 代码构成的 WASM 功能文件，由于 WebAssembly 强大的性能和跨平台特性，使得在浏览器上也可以直接运行 cn-font-split。

## 打包字体文件的流程

打包字体文件在 cn-font-split 中主要分为下面几个步骤，[这一部分代码集中在这里](https://github.com/KonghaYao/cn-font-split/blob/0aba77d4093068c1c1d543745bfae47ecb5fc73d/packages/subsets/src/main.ts#L1)

1. 读取字体文件二进制，字体文件主要类型为主流的 otf 或者 ttf 字体文件。其它类型的字体将会转化为 otf 类型进行操作。
2. 解析字体的基础信息，包括字体的名称、大小、授权信息等
3. 生成 svg 文件
    1. svg 比 png 更加节省空间和性能
4. 收集字体中的字形编码信息和字形特性的映射关系。
    1. 这一步主要是维持 font feature 需要
5. 根据上一步的信息进行预分包（PreSubset）
    1. 优先对用户选定的强制分包集合进行分包
    2. 获取包内所有的 unicode 字符集
    3. 排除强制分包集合
    4. 进行区间分包，比如拉丁字符集和中文字符集都在这个阶段单独进行分包处理
    5. 通过均匀采样分包，初步预估分包的大小，
    6. 限制每个包内的最大字符数，防止出现极端大值
    7. 得到第一次分包结果
    8. 对第一次分包结果进行小值碎片清理，保证每个包大小合适
6. 根据预分包信息进行分包构建
    1. 构建完成之后的字体分包为 otf 二进制类型。
7. 通过多线程模式将 otf 二进制发送至 woff2 压缩线程，进行格式转换
    1. 多线程带来的速度加成非常明显，但是需要多个 CPU
8. 收集打包过程中的所有进程信息，生成 css 文件、报告文件等信息
