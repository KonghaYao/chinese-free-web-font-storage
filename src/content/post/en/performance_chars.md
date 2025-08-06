---
index: 40
title: 'Deep Dive into cn-font-split: Three Core Technologies for CJK Font Subsetting'
description: 'This article delves into the three core font subsetting optimization techniques in cn-font-split 7.0.0+: language-based segmentation, lexicon-based associativity sorting, and progressive subsetting. These technologies work in concert to significantly improve web font loading performance and user experience for CJK languages.'
article:
    authors:
        - 'KongHaYao'
    section: 'Performance Optimization'
    tags:
        - 'Performance Optimization'
        - 'Font Subsetting'
        - 'cn-font-split'
    pubDate: 2025-08-06
    image: 'https://ik.imagekit.io/chinesefonts/tr:w-1200/image/photo-1508804185872-d7badad00f7d.jfif'
---

# Deep Dive into cn-font-split: Three Core Technologies for CJK Font Subsetting

In the long-term evolution of the "Chinese Web Font Program," font subsetting has always been the core of performance optimization. A complete Chinese font can easily be several megabytes, or even tens of megabytes, in size. Using it directly on a webpage without processing would significantly impact the user experience. The `cn-font-split` 7.0.0+ release enhances the effectiveness of font subsetting by introducing a series of advanced algorithms. This article will dissect the three core strategies behind it and explore their design philosophy in the context of industry best practices.

## Strategy 1: Language-Based Segmentation to Strip Unrelated Glyphs

A modern trend in font design is "pan-language" support, meaning a single font file might contain glyphs for various languages like Latin, Cyrillic, Chinese, Japanese, and Korean. While comprehensive, this adds an extra loading burden to web applications. A predominantly Chinese website has no need to force users to download a full font that includes thousands of rarely used non-Chinese characters.

The industry-standard solution, as discussed in technical articles from sources like `CSS-Tricks`, is to use the `unicode-range` descriptor in CSS for font subsetting. This allows a large font to be split into multiple smaller subsets based on language or character sets. Major font services like Google Fonts widely adopt this strategy. `cn-font-split` uses this practice as its first optimization step. It automatically identifies the characters in the original font and segments them into independent character blocks by language (e.g., `Latin`, `Arabic`, `ZH_SC`).

The advantages of this approach are:

- **Minimized Initial Load**: For most websites, loading just the few-kilobyte Latin character set is sufficient for basic interface rendering, helping to optimize the First Contentful Paint (FCP) time.
- **On-Demand Loading**: The browser intelligently downloads only the `unicode-range` subset containing the characters actually present on the page.
- **Improved Caching Efficiency and Stability**: Small, stable language packs like the Latin set can be cached by the browser for long periods, and their caching policy is not affected by the dynamic changes in Chinese character subsets.

## Strategy 2: Lexicon-Based Associativity Sorting to Optimize Subset Internal Structure

After the initial segmentation by language, we are left with a collection of thousands, or even tens of thousands, of Chinese characters. A core problem then arises: in what order should these characters be arranged to achieve maximum efficiency in the subsequent splitting phase? Simply sorting by encoding (like Unicode order) or by individual character frequency can create a performance bottleneck. A high-frequency word like "性能优化" (performance optimization) might have its constituent characters—"性," "能," "优," "化"—scattered across different subsets due to slight differences in their individual frequencies or encoding positions. This would force the browser to make multiple network requests to render a single word.

The core idea behind this technique shares common ground with the "Topical Subsetting" proposed by Google in its technical disclosure, "Learning Better Font Slicing Strategies from Data." In academia, research such as "Sub-character Neural Language Modelling in Japanese" also shows that using machine learning models to predict co-occurrence relationships between characters can improve the predictive power of language models, providing theoretical support for this strategy's effectiveness.

`cn-font-split` puts this idea into practice. Its implementation does not rely on a dynamic model execution at runtime. Instead, it utilizes a pre-calculated, optimal character order. This order was generated once by the development team using a **Markov chain model** trained on a massive Chinese dataset. The model's predictions of character co-occurrence probabilities were used to generate a static, built-in sorting table that clusters highly associated characters (like "性" and "能," which form a common word) together.

This optimization, based on semantic association, is a key step that enhances the "raw material" for subsetting at a higher level:

- **Improved Data Locality**: By grouping strongly related characters, it increases the probability that characters forming common words will reside in the same subset, regardless of how the final splitting is done.
- **Foundation for Efficient Loading**: It addresses the efficiency problem at the network request level, preparing an optimally structured dataset for the next step, the progressive subsetting strategy.
- **Determinism and High Efficiency**: Since the sorting is pre-calculated and fixed, the tool produces consistent results every time and avoids the performance overhead of running a complex model during the subsetting process.

## Strategy 3: Progressive Subsetting for Precise On-Demand Loading

After the associativity sorting, we have a long, intelligently organized list of characters. However, this list is still too large to be used as a single font file. The question now is how to slice it. The traditional approach might be to cut it into N equally sized subsets, but this is inefficient. A simple page displaying only a few words would be forced to download a large subset containing thousands of characters.

The ideal industry solution is known as "Dynamic Subsetting," and tools like `glyphhanger` aim to achieve this by analyzing page content and serving only the required characters. `cn-font-split` approaches this ideal with a clever engineering solution: the **Incremental Packet Algorithm**.

This algorithm splits the sorted character list into multiple, smaller packets whose sizes **progressively increase**. For instance, the first packet might contain the 100 most essential characters, the second might contain the next 200, the third the following 400, and so on. The characters placed at the very beginning are those identified by the Markov chain model as having the highest frequency and strongest associations.

![Incremental Packet Algorithm](/assets/increase_chars.png)

This structure offers significant performance benefits:

- **High Loading Flexibility**: A short page only needs to download the smallest initial packet, while a longer page can load subsequent packets on demand. This precisely matches content needs and avoids the "one-size-fits-all" download of a large subset.
- **Effective Redundancy Control**: It ensures that any given page downloads the minimum character set required for its content, minimizing bandwidth costs for glyphs the user will never see.
- **Accelerated Critical Rendering Path**: The most frequent and core characters are placed in the smallest, highest-priority packets, allowing the main content of the page to be rendered correctly faster, thus improving perceived performance.

## Conclusion

The font subsetting in `cn-font-split` is a systematic optimization solution. It doesn't rely on a single dimension of optimization but rather constructs a layered, progressive loading strategy:

- First, it lays the optimization groundwork by stripping away useless character sets through **language-based segmentation**, an industry-standard practice.
- Next, it performs a deep internal-structure optimization on the core character set with **lexicon-based associativity sorting**, clustering related characters.
- Finally, it achieves an engineering implementation of "dynamic subsetting" through **progressive subsetting**, using incrementally sized packets for ultimate on-demand loading.

The organic combination of these core strategies ensures that `cn-font-split` can provide an excellent Chinese font rendering experience with minimal bandwidth cost and faster loading speeds, regardless of the application scenario.
