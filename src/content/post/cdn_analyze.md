---
title: 【数据分析】CDN 性能概况
description: 这篇文章将介绍中文网字计划使用的 CDN 使用情况
article:
    authors:
        - 江夏尧
    section: 技术内幕
    tags:
        - 性能优化
    pubDate: 2023-10-8
    image: 'https://ik.imagekit.io/chinesefonts/tr:w-1200/image/photo-1508804185872-d7badad00f7d.jfif'
---


# 【数据分析】CDN 性能概况

## LightCDN 

中文网字计划使用 LightCDN 的免费服务的数据统计如下：

|  Visitor Country | Total traffic | Avg latency | Avg transfer rate |
|  --- | --- | --- | --- |
|  China | 7.59 GB | 192 ms | 68.39 KB |
|  Hong Kong-China | 1.42 GB | 30 ms | 271.65 KB |
|  United States | 1.38 GB | 60 ms | 289.81 KB |
|  Japan | 850.52 MB | 20 ms | 436.83 KB |
|  Taiwan-China | 487.91 MB | 70 ms | 211.49 KB |

根据给出的列表格，我们可以看出该 CDN 的使用情况主要分布在东亚地区和美国。

中国大陆地区的使用量非常大，但是由于节点分布在香港和日本东京这些比较偏远的地区，对于内陆的覆盖面小，导致其平均传输量刚好和我们 cn-font-split 的默认切割大小差不多，所以效果还是勉勉强强。

在美国、新加坡和日本这些靠近边缘服务器的地区，其运输的延迟和承载能力都非常强，非常适合于字体的加载。

> 注：某些节日和特别时期期间，国外节点统统不稳定，这个是没办法的事情。
