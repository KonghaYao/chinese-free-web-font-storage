---
title: 【字体分包】支持复杂字形等特性
description: 字体分包工具研发中，针对于字体特性的支持的实现依赖于我们独特的算法
article:
    authors:
        - 江夏尧
    section: 技术内幕
    tags:
        - 性能优化
    pubDate: 2023-7-16
    image: ''
---

# 【字体分包】支持复杂字形等特性

cn-font-split 在 4.5.0 版本之后，通过特殊的分包算法支持了特殊字形的渲染。我们针对于字形特性，制作了较为简单的示例网页，
[特性渲染页](/feature/test)。

## 网络字体在复杂字形渲染方面的困难

浏览器在渲染复杂字形时，需要组成复杂字形的所有字形在同一个分包内，这样浏览器才将他们渲染为这个包中的复杂字形。

其中困难之处就是将众多的复杂字形触发的字和最终显示的字从原始文件中抽取出来并归为一包。于是我决定在进行分包算法时，提前计算 Features 并分布至单独分包内部，从而实现复杂字形特性的渲染。

## OpenType Features 的存储方式

OpenType 字体将所有的字形存储在 glyf 表中，而字体特性通过 [GSUB 表](https://learn.microsoft.com/zh-cn/typography/opentype/spec/gsub) 存储。

### GSUB

GSUB 表的存储方式非常复杂，具有非常多的存储形式，能够表示非常多种类的字形替换方式。
由于 Features 非常多而且复杂，OpenType 定义了每个特性的 Tag，并做出了相应的使用说明和二进制存储方式声明，具体每个 Tag 的声明可以 [查看这里](https://learn.microsoft.com/zh-cn/typography/opentype/spec/featurelist)。

为了简化字体 features 数据的获取，我们采用了 opentype.js 用于解析字体中的 GSUB 表，并获取其处理后的 features。

```ts
import { parse } from 'opentype.js';
const font = parse(ttfFile.buffer);
const substitution = font.substitution.getFeature('aalt');
// substitution 是一个包含原字形和替换字形的对象，aalt 是一个 Feature Tag
```

### GPOS

有些字体特性存储于字体文件的 GPOS 表，但是 opentype.js 对这个表的支持非常不好，所以，我们对于 使用了 GPOS 相关的特性也支持不佳。

## 单独汇集特性所需要的 unicode

opentype.js 中获取的 `substitution` 中包含了多个 `Glyph`（字形），这些 `Glyph` 指向其对应的一个具体的 unicode 编码。接下来只需要获取到特性的原字形和替换字形对应的 unicode 值并聚合为一个数组。这个数组内的 unicode 需要在分包时，同时划分到一个包内部，然后通过已有的分包程序自动地将该特性字形单独成包，从而实现成品 woff2 字体文件可以在一个包内支持这个特性。
