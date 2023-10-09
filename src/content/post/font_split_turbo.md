---
title: 字体分包性能优化
description: 这篇文章将介绍 cn-font-split 在 4.0 版本中的各项性能优化
article:
    authors:
        - 江夏尧
    section: 技术内幕
    tags:
        - 性能优化
    pubDate: 2023-5-23
    image: 'https://ik.imagekit.io/chinesefonts/tr:w-1200/image/photo-1508804185872-d7badad00f7d.jfif'
---

# 字体分包性能优化

在 4.0 版本中，我们采用了多线程和基于 WebAssembly 的插件，使得我们的分包时间从原先的 19s 缩减到了 5s，并且通过一些特殊操作实现了跨平台通用。那么我们是如何实现这一些功能的呢？

## Harfbuzz（WASM） 进行字体分包

在 3.0 版本中，我们使用 Javascript 插件 fonteditor-core 进行字体文件的解析，这是一个缓慢的过程，解析过程中遇到特殊的字体情况还会导致某些 BUG。于是我们在 Github 社区中搜寻一个兼顾性能、专业性和兼容性的解决方案。

经过许久的大海捞针，我们找到了 Harfbuzz 项目，一个使用 C++ 编写、用于在各个平台中解析字体文件并进行渲染的开源仓库。Harfbuzz 的 Wasm 版本在 cn-font-split 中起到了解析字体文件、获取字体中 unicode 覆盖范围、直接生成分包文件的作用，是 cn-font-split 最核心的一个插件。

该项目提供了一个 Wasm 打包成品，其中有 subset 功能分包，但是 JS binding 却是人工编写的，TS 类型也缺失较多。所以我们对其进行了二次封装，把 Wasm 导出的 API 整合为了面向对象的一个库文件，这样在我们的项目中就可以轻松调用了。同时因为我们需要读取字体的某些属性，这些属性又没有在 subset 功能分包中进行导出，所以我们就直接修改了原始的项目（查看 C++ 代码看得头疼 😂），使得其能够兼容更多的功能。

## 多线程优化

通过利用多个 CPU 核心的优势，转化最慢的步骤为多线程运行，并行打包速度极快！

### 多线程为何那么快？

JS 多线程由多个 Worker 构成，由主线程的一个线程池进行生成、运作和销毁的功能。

1. 每个 Worker 持有相同的代码，并且 Worker 中还可以使用 WebAssembly；
2. 每个线程单独运行，不阻塞主线程；
3. 每个线程将会被分配到独立 CPU 中进行计算，可以最大化利用多核心优势。

拥有这些优点之后，只需要将长时间、重计算类的函数分配到 Worker 线程中，那么就可以在多核情况下，同时进行多个耗时任务，总时间就少了。

### 多线程在项目中优化了哪一部分？

首先，在单线程版本中，我们观察到了 woff2 库将 ttf 字体压缩为 woff2 字体的速度是非常慢的，大约需要 500ms 一次，而解析分包只需要 5ms 一次 😂。所以大量时间被消耗在了这个串行过程中，如果通过利用 CPU 多核心的特性，那么速度可以大幅度提升。

所以我们将这部分代码直接内置在了 Worker 线程中，并通过 workerpool 库的封装，逻辑上简化为一个函数交给主线程使用。在主线程中直接申请一次调用，并传入二进制数据即可实现多线程调用。workerpool 帮你实现了自动分配线程、通信数据封装、自动销毁线程等操作，剩下的时间可以休息一下 🍻。

代码中有些小细节，我们使用 transferable 的方式**转移二进制**，而非默认的**拷贝二进制**。因为主线程中，这个 ttf 文件的数据不再需要了，可以转移；同时，线程中产生的结果二进制也是不被内部需要的，也可以进行转移。二进制数据直接通过转移的手法可以节省一部分的内存，避免极端情况下内存不足的尴尬。

```ts
const transferred: Uint8Array = await service.pool.exec('convert', [buffer, targetType], {
    transfer: [buffer.buffer], // 传递 buffer
});
```

### 多线程有趣的点

1. 多线程不一定比单线程快：我曾经对那个 5ms 的函数进行了多线程封装，结果发现创建线程和线程数据传输总时间达到了 1.5s 一次 😂。非重计算的函数，还是走主线程就够了。
2. 多线程数据传回主线程会阻塞：多线程运行不会阻塞，返回的数据会阻塞。你的主线程只有一个，一旦在极短时间内返回大量数据，还是并发，主线程仍然没法快速处理，需要一个一个串行解决，这样就导致了多线程比单线程还耗时。
3. Javascript 在浏览器中的内存共享方案 SharedArrayBuffer 需要特殊的跨域设置，并且有些浏览器不支持。出于兼容性考虑，我们并没有使用它。
4. 浏览器中创建 worker 需要严格的同源策略，不允许 worker 脚本本身是跨域的；但是 worker 的 `importScripts`、`import ` 却可以导入跨域脚本，所以我们在浏览器的兼容上多封装了一层 😂。

## 强大的兼容性

cn-font-split 实现了 Nodejs、Deno、Browser 的平台兼容，并且在性能上未见特大衰减！

### 各个平台的考量

因为考虑到前端工程化的重心是在 Nodejs 端的，开发者手中也自然是可以通过 npm 快速安装 cn-font-split。浏览器端可以让开发者随处可用，当你只需要分包一个字体文件的时候，肯定不想再写一串代码啦。而 Deno 端则是新兴的 Runtime，速度要比 Nodejs 快一点点，其遵循浏览器标准，很方便移植，所以我们也特别地进行了兼容。

### 文件系统的兼容

文件系统在各个平台的使用方式都是不同的，node 使用 fs、Deno 使用 Deno fileSystem API，而浏览器只有 fetch 请求远端文件。同时请求文件还有一些特殊，WebAssembly 的项目一般都是自动生成的加载文件，里面需要动用文件系统获取 wasm 文件，这个也需要兼容。所以我们直接将需要加载的过程都进行了适配层的封装，保证在项目中使用同一 API 即可加载，存储数据。

1. 判断运行环境

判断运行环境是做兼容性的基础，通过判断运行环境区别 Nodejs 和 Deno 然后进行各自文件系统的调用可以节省很多不必要开销。文件系统路径和 URL 是两种表示资源存储位置的方式，但是浏览器只支持 URL，那么就需要根据环境进行转换。

2. 使用 AssetsMap 统一文件获取方式

AssetsMap 通过代理名称获取实际路径、结合兼容性 API 实现文件获取和存储操作。同时舍弃通过冗长的路径字符串表示文件的逻辑，使用一个别名来简化路径表示，配合 Typescript 类型声明可以保证路径正确性。

在适配方面，通过对外暴露修改映射关系的方式，使得程序在浏览器端可以将文件替换为 HTTP 协议的网络路径，从而实现兼容浏览器。

```ts
/** 异步地导入本地数据 */
class AssetsMap {
    //...
    async loadFileAsync(token: K | string): Promise<Uint8Array> {
        const targetPath = this.ensureGet(token);
        if (isNode) {
            const {
                promises: { readFile },
            } = await import('fs');
            return readFile(await resolveNodeModule(targetPath)).then((res) => {
                return new Uint8Array(res.buffer);
            });
        } else if (
            isBrowser ||
            isInWorker ||
            ['https://', 'http://'].some((i) => targetPath.startsWith(i))
        ) {
            return this.loadFileResponse(token)
                .then((res) => res.arrayBuffer())
                .then((res) => new Uint8Array(res));
        } else if (isDeno) {
            return Deno.readFile(targetPath);
        }
        throw new Error('loadFileAsync 适配环境失败');
    }
    //...
}
// Assets 是一个 AssetsMap 实例，下面是直接修改相应的配置
Assets.redefine({
    'hb-subset.wasm': root + '/dist/browser/hb-subset.wasm',
    'cn_char_rank.dat': root + '/dist/browser/cn_char_rank.dat',
    'unicodes_contours.dat': root + '/dist/browser/unicodes_contours.dat',
});
```

### 兼容适配特殊 API

Nodejs 端缺失一大堆如 fetch、location 等的 Web API，而 Deno 缺失 XHR 和 classic worker 的支持，浏览器端虽然比较全面，但是没有 crypto 加密手段。这些情况都需要开发者进行 polyfill，保证多端的正常运行。

例如，对于 worker 的不一致，cn-font-split 使用了 workerpool 插件，并且在打包时做了 classic worker 到 module worker 的转换。而 fetch、XHR 等 API 缺失，我们使用了将模块中的对象导出并赋值到 globalThis 上进行解决。 crypto 缺失则使用了一些算法实现库替代。

总体而言，兼容是一件麻烦事，需要做很多的操作才能实现较好的效果，这个过程中对于环境、对于库的运用都需要娴熟的意识和丰富的阅历，才能避免其导致整个程序 BUG。

## 结言

探索性能优化的过程是艰辛的，但也是我成长最快的一次旅行。这次旅行给了我一次看向完整 Javascript 生态的机会、探索陌生的多线程编程的机会、进入字体优化领域的机会。这篇文章并未覆盖整个 4.0 的优化史，更多 4.0 优化的细节可在源码中细细品味。
