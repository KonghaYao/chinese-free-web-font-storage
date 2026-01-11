# Solid.js + Vinxi → Astro 静态构建迁移计划

## 项目背景

项目从 Astro 迁移到 Solid.js + Vinxi 后，现决定迁回 Astro **静态构建**（Static Site Generation）。当前项目是基于 Solid.js 的全栈应用，使用 Vinxi 作为构建工具。

**重要变更**:

- **无 SSR** - 纯静态构建
- **pnpm** - 包管理器
- **Tailwind CSS** - 移除 Less

---

## 当前架构分析

### 核心技术栈

| 技术            | 用途                |
| --------------- | ------------------- |
| Solid.js        | 前端框架            |
| Vinxi           | 构建工具 & SSR 服务 |
| @solidjs/start  | Solid.js 起手架     |
| @solidjs/router | 文件系统路由        |
| @cn-ui/core     | UI 组件库           |
| cn-font-split   | 字体分包（WASM）    |
| i18next         | 国际化              |
| MDX             | 文章内容            |

### 项目结构

```
src/
├── routes/[lang]/          # 多语言路由
│   ├── _index/             # 首页组件
│   ├── _cdn/               # CDN 功能
│   ├── _analyze/           # 字体分析
│   ├── _online-split/      # 在线分割（WASM）
│   ├── fonts/[font]/       # 字体详情
│   └── post/[slug].tsx     # 文章页面
├── layouts/                # 布局组件
├── components/             # 可复用组件
├── utils/                  # 工具函数
├── i18n/                   # 国际化配置
├── content/post/           # MDX 文章
├── api/                    # API 端点
├── app.tsx                 # 应用入口
└── middleware.ts           # 中间件（路由重定向）
```

### 关键功能模块

#### 1. 国际化 (i18n)

- **实现方式**: 服务端根据 URL 路径动态加载语言包，客户端通过 Context 传递
- **语言**: `zh-cn`, `en`
- **路由**: `/zh-cn/...`, `/en/...`
- **特点**: 服务端预加载所有语言包，客户端只加载当前语言

#### 2. 字体 CDN 代理

- **文件**: `routes/font-cdn/[...font_path].ts`
- **实现**: 代理到 `https://chinese-fonts-cdn.deno.dev`

#### 3. 在线字体分割 (WASM)

- **文件**: `routes/[lang]/_online-split/wasm.tsx`
- **依赖**: `cn-font-split/dist/wasm/index`
- **特点**: 纯前端 WASM 字体分割，支持拖拽上传

#### 4. MDX 文章系统

- **文件**: `routes/[lang]/post/[slug].tsx`
- **实现**: `import.meta.glob` 动态导入 MDX 文件
- **插件**: remark 系列插件处理 TOC、frontmatter、高亮

#### 5. ECharts 图表

- **文件**: `components/ECharts.tsx`
- **实现**: 服务端渲染 SVG 字符串，客户端直接插入

#### 6. 字体分析工具

- **路径**: `routes/[lang]/_analyze/`
- **功能**: 字符覆盖度、字形渲染、Feature 支持

---

## 迁移目标架构

### 技术栈调整

| 当前            | 迁移后                   |
| --------------- | ------------------------ |
| Solid.js        | Solid.js (Astro Islands) |
| Vinxi (SSR)     | Astro (Static Build)     |
| @solidjs/router | Astro 文件系统路由       |
| @cn-ui/core     | 保留                     |
| i18next         | astro-intl               |
| @solidjs/meta   | Astro `<head>` 管理      |
| Less            | Tailwind CSS             |

**关键差异**:

- **静态构建**: 构建时生成所有 HTML，无服务端渲染
- **pnpm**: 替代 npm 作为包管理器
- **纯 Tailwind**: 移除 Less 预处理器

### 目标结构

```
src/
├── pages/                  # Astro 文件系统路由
│   ├── [lang]/            # 多语言路由
│   │   ├── index.astro
│   │   ├── cdn.astro
│   │   ├── analyze.astro
│   │   ├── online-split.astro
│   │   ├── fonts/[font]/[name].astro
│   │   └── post/[slug].mdx
├── layouts/
│   ├── HomeLayout.astro
│   └── PostLayout.astro
├── components/            # 保留 Solid.js 组件
│   ├── FontShow.tsx       # Solid.js Island
│   ├── SearchBox.tsx      # Solid.js Island
│   ├── WASMSplit.tsx      # Solid.js Island
│   └── ECharts.astro      # Astro 组件（SSR，可保留 .tsx）
├── i18n/
│   └── ui.ts              # 国际化工具
├── content/post/          # MDX 内容集合
├── routes/                # 保留 Solid.js 组件目录
│   └── [lang]/
│       ├── _index/        # 复用现有组件
│       ├── _cdn/
│       ├── _analyze/
│       └── _online-split/
├── endpoints/             # API 端点
│   └── font-cdn/[...path].ts
└── middleware.ts          # Astro 中间件
```

---

## 迁移策略

### Phase 1: 基础设施搭建

1. **清理现有构建配置**

    ```bash
    rm -f app.config.ts
    rm -f tsconfig.json
    ```

2. **安装 Astro 核心**

    ```bash
    pnpm add astro
    pnpm add -D @astrojs/solid-js @astrojs/tailwind @astrojs/mdx
    pnpm add astro-intl
    ```

3. **初始化 Astro 配置**

    ```javascript
    // astro.config.mjs
    import { defineConfig } from 'astro/config';
    import solidjs from '@astrojs/solid-js';
    import tailwind from '@astrojs/tailwind';
    import mdx from '@astrojs/mdx';

    export default defineConfig({
        output: 'static', // 静态构建
        integrations: [solidjs(), tailwind(), mdx()],
    });
    ```

4. **移除 Less 配置**
    ```bash
    pnpm remove -D less
    # 删除所有 .less 文件，转换为 CSS/Tailwind
    ```

**注意**: 使用 `@astrojs/solid-js` + 静态构建模式

### Phase 2: 国际化迁移

1. **使用 astro-intl**

    ```typescript
    // src/i18n/ui.ts
    import { createI18n } from 'astro-intl/en';

    export const { t, lang, getStaticPaths } = createI18n({
        locales: ['zh-cn', 'en'],
        defaultLocale: 'zh-cn',
        fallbackLocale: 'zh-cn',
    });
    ```

2. **迁移路由**
    ```astro
    ---
    // src/pages/[lang]/index.astro
    import { t, lang } from '~/i18n/ui'
    const { lang } = Astro.params
    ---
    <h1>{t('welcome')}</h1>
    ```

### Phase 3: 组件迁移

#### 策略

| 组件类型      | 迁移方案                           |
| ------------- | ---------------------------------- |
| 所有现有组件  | 保留为 Solid.js，通过 Islands 嵌入 |
| 纯服务端逻辑  | Astro 组件                         |
| WASM 复杂逻辑 | Solid.js Island (client:load)      |

#### 具体迁移

**1. 直接复用现有 Solid.js 组件**

```astro
---
// src/pages/[lang]/index.astro
import FontsList from '~/routes/[lang]/_index/FontsList'
import FontShow from '~/routes/[lang]/_index/FontShow'
---
<section id="font-list">
  <FontShow client:visible />
  <FontsList client:idle />
</section>
```

**2. WASM 分割组件（保持不变）**

```tsx
// src/routes/[lang]/_online-split/wasm.tsx
// 完全保留现有代码，无需修改
export default () => {
    // Solid.js 逻辑
    return <section>...</section>;
};
```

```astro
---
// src/pages/[lang]/online-split.astro
import WASMSplit from '~/routes/[lang]/_online-split/wasm'
---
<WASMSplit client:load />
```

**3. 搜索组件（保持不变）**

```astro
---
// src/pages/[lang]/cdn.astro
import SearchBox from '~/routes/[lang]/_cdn/SearchBox'
---
<SearchBox client:visible />
```

### Phase 4: 路由迁移

#### 文件系统路由映射

| Solid.js                                | Astro                                    |
| --------------------------------------- | ---------------------------------------- |
| `routes/[lang]/index.tsx`               | `pages/[lang]/index.astro`               |
| `routes/[lang]/cdn.tsx`                 | `pages/[lang]/cdn.astro`                 |
| `routes/[lang]/fonts/[font]/[name].tsx` | `pages/[lang]/fonts/[font]/[name].astro` |
| `routes/[lang]/post/[slug].tsx`         | `pages/[lang]/post/[slug].mdx`           |

#### 静态构建路由处理

**无中间件** - 静态构建使用 `getStaticPaths` 生成所有路由：

```astro
---
// src/pages/[lang]/index.astro
import { t } from '~/i18n/ui'

export function getStaticPaths() {
  return [
    { params: { lang: 'zh-cn' } },
    { params: { lang: 'en' } },
  ]
}

const { lang } = Astro.params
---
<h1>{t('welcome', lang)}</h1>
```

**语言重定向** - 通过 `public/index.html` 实现：

```html
<!-- public/index.html -->
<!DOCTYPE html>
<meta http-equiv="refresh" content="0; url=/zh-cn/" />
```

### Phase 5: 静态资源处理

#### CDN 代理（静态构建方案）

**方案 A: 直接使用外部 CDN**

```astro
---
// 直接引用外部 CDN
const __CDN__ = 'https://chinese-fonts-cdn.deno.dev'
---
<link href={`${__CDN__}/packages/.../result.css`} rel="stylesheet" />
```

**方案 B: 构建时复制字体文件**

```javascript
// astro.config.mjs
export default defineConfig({
    output: 'static',
    build: {
        assets: '_fonts', // 字体输出目录
    },
    vite: {
        plugins: [
            {
                name: 'copy-fonts',
                writeBundle() {
                    // 构建时下载字体文件到 public/_fonts
                },
            },
        ],
    },
});
```

**推荐**: 使用方案 A，直接引用外部 CDN，减少构建时间和站点体积。

### Phase 6: 样式迁移

#### Tailwind CSS 配置

```javascript
// tailwind.config.mjs
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,svelte,vue}'],
    // 现有配置保持不变
};
```

#### Less → Tailwind 转换

**转换原则**:

1. **嵌套选择器** → Tailwind 原子类
2. **变量** → Tailwind 配置或 CSS 变量
3. **Mixins** → 组件类或 `@apply`

**示例**:

```less
// 转换前 (CDNHome.less)
.cdn-home {
    .hero {
        @apply grid grid-cols-12 gap-12;
        .title {
            @apply text-6xl pb-8;
        }
    }
}
```

```astro
<!-- 转换后 -->
<div class="cdn-home">
  <div class="hero grid grid-cols-12 gap-12">
    <h2 class="title text-6xl pb-8">...</h2>
  </div>
</div>
```

**批量转换脚本**:

```bash
# 查找所有 .less 文件
find src/routes -name "*.less" -type f

# 手动转换或使用工具转换
```

### Phase 7: 关键功能详细迁移

#### 7.1 ECharts SSR 迁移

当前实现：服务端渲染 SVG 字符串

```tsx
// Solid.js 当前实现
import { createAsync } from '@solidjs/router';

export const ECharts = (props) => {
    const info = createAsync(async () => {
        'use-server';
        const myChart = await renderSVGChart(props.options);
        return myChart.renderToSVGString();
    });

    return <div innerHTML={info()}></div>;
};
```

Astro 迁移方案（保持 Solid.js 组件）：

```astro
---
// src/pages/[lang]/some-page.astro
import ECharts from '~/components/ECharts'
---
<ECharts options={chartData} client:idle />
```

```tsx
// src/components/ECharts.tsx (保持不变)
import { createAsync } from '@solidjs/router';

export const ECharts = (props) => {
    const info = createAsync(async () => {
        'use-server';
        const myChart = await renderSVGChart(props.options);
        return myChart.renderToSVGString();
    });

    return <div innerHTML={info()}></div>;
};
```

#### 7.2 MDX 文章系统迁移

当前使用 `import.meta.glob` 动态导入：

```typescript
// Solid.js 当前实现
const allContents = import.meta.glob('~/content/post/**/*.md');
export const getArticleComponent = (lang: string, slug: string) => {
    return import(`~/content/post/${lang}/${slug}.md`);
};
```

Astro 推荐使用 Content Collections：

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
    integrations: [mdx()],
});
```

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const post = defineCollection({
    schema: z.object({
        title: z.string(),
        description: z.string(),
        keywords: z.string(),
        pubDate: z.date(),
    }),
});

export const collections = { post };
```

```astro
---
// src/pages/[lang]/post/[slug].astro
import { getCollection } from 'astro:content'
import PostLayout from '~/layouts/PostLayout.astro'

export async function getStaticPaths() {
  const posts = await getCollection('post')
  return posts.map(post => ({
    params: { lang: post.id.split('/')[0], slug: post.slug },
    props: { post },
  }))
}

const { post } = Astro.props
const { Content } = await post.render()
---
<PostLayout {...post.data}>
  <Content />
</PostLayout>
```

#### 7.3 字体分析工具迁移

分析工具包含多个子模块，直接复用现有组件：

```astro
---
// src/pages/[lang]/analyze.astro
import Index from '~/routes/[lang]/_analyze/index'
---
<Index client:load />
```

所有子组件（Coverage、GlyphInspector、FeatureTable）无需修改。

#### 7.4 在线分割 (WASM) 迁移

WASM 模块直接复用，无需修改：

```tsx
// src/routes/[lang]/_online-split/wasm.tsx (完全保持不变)
import { fontSplit, StaticWasm } from 'cn-font-split/dist/wasm/index';

const wasm = new StaticWasm('...');

export default () => {
    // Solid.js 逻辑保持不变
    return <section>...</section>;
};
```

```astro
---
// src/pages/[lang]/online-split.astro
import WASMSplit from '~/routes/[lang]/_online-split/wasm'
---
<WASMSplit client:load />
```

### Phase 8: 工具函数迁移

#### 8.1 响应式状态管理

完全保留 `@cn-ui/reactive`，因为 Solid.js 组件内部逻辑不变：

```typescript
// Solid.js (保持不变)
import { atom, ArrayAtom } from '@cn-ui/reactive';
const file = atom<File | null>(null);
const logMessage = ArrayAtom<string[]>([]);
```

Astro 组件使用服务端数据获取：

```astro
---
// Astro 页面
const data = await fetchData()
---
<Component data={data} client:load />
```

#### 8.2 字体工具函数

保留纯函数工具：

```typescript
// src/utils/fonts.ts
export async function getFontList() {
    const index = await import('../../../index.json');
    return Object.entries(index.default).map(([id, font]) => ({
        id,
        ...font,
    }));
}

export function getFontReporter(font: string, name: string) {
    // 业务逻辑保持不变
}
```

---

## 依赖调整

### 需要移除

```bash
npm uninstall \
  @solidjs/start \
  @solidjs/router \
  @solidjs/meta \
  @vinxi/plugin-mdx \
  vinxi
```

### 需要新增

```bash
npm install \
  astro \
  @astrojs/solid-js \
  @astrojs/tailwind \
  @astrojs/mdx \
  astro-intl/en

npm install -D \
  @astropub/less
```

### 保留不变

- `solid-js` - 核心框架
- `@cn-ui/core` - UI 组件库
- `@cn-ui/reactive` - 响应式状态
- `cn-font-split` - WASM 字体分割
- `font-analyze` - 字体分析
- `echarts` - 图表
- `i18next` - 国际化（或迁移到 astro-intl）
- `tailwindcss` - 样式
- `less` - 样式预处理

---

## 潜在风险与解决方案

| 风险                    | 解决方案                                                 |
| ----------------------- | -------------------------------------------------------- |
| Solid.js Islands 兼容性 | 使用官方 @astrojs/solid-js 集成                          |
| WASM 模块加载           | 确保 client:load 指令正确使用                            |
| MDX 插件兼容            | 测试 remark/rehype 插件在 Astro 中兼容性                 |
| 服务端渲染差异          | Astro 服务端环境无 DOM，需适配                           |
| 路由参数访问            | Astro 页面使用 `Astro.params`，Solid 组件通过 props 传递 |
| 中间件 API 差异         | Vinxi → Astro 中间件 API 不同                            |
| @cn-ui/core 服务端渲染  | 确保组件仅在客户端水合（client:\* 指令）                 |

---

## 迁移步骤总结

1. **新分支初始化**

    ```bash
    git checkout -b migrate-to-astro
    ```

2. **安装 Astro 依赖**

    ```bash
    npm create astro@latest . -- --template minimal --no-install --no-git
    npm install
    npx astro add react tailwind mdx
    ```

3. **迁移配置文件**

    - 复制 `tailwind.config.mjs`
    - 创建 `astro.config.mjs`
    - 配置 Less 插件

4. **迁移布局**

    - `src/layouts/HomeLayout.astro` - 新建 Astro 布局
    - `src/layouts/PostLayout.astro` - 新建 Astro 布局
    - 保留 `src/routes/[lang]/_index/*` 等组件目录

5. **迁移核心页面**（按优先级）

    - `src/pages/[lang]/index.astro` - 嵌入现有 `_index/*` 组件
    - `src/pages/[lang]/cdn.astro` - 嵌入现有 `_cdn/*` 组件
    - `src/pages/[lang]/post/[slug].mdx` - 配置 Content Collections

6. **嵌入 Solid.js 组件**

    - 使用 `client:load`、`client:idle`、`client:visible` 指令
    - 通过 props 传递服务端数据

7. **迁移 API**

    - `src/routes/font-cdn/[...font_path].ts` → `src/pages/font-cdn/[...path].ts`

8. **测试验证**

    - 本地开发测试
    - 构建验证
    - 部署预览

9. **清理旧代码**
    ```bash
    npm uninstall @solidjs/start @solidjs/router @vinxi/plugin-mdx vinxi
    rm -f src/app.tsx src/entry-server.tsx src/entry-client.tsx
    ```

---

## 迁移优势

1. **代码复用率高** - 90%+ Solid.js 组件无需重写
2. **渐进式迁移** - 可按页面逐步迁移，降低风险
3. **保留生态系统** - 继续使用 @cn-ui/core 和 @cn-ui/reactive
4. **Astro 性能优势** - 默认零 JS，按需水合
5. **更好的 SEO** - Astro 的服务端渲染更成熟

## 迁移现状检查 (2026-01-11)

### Phase 1: 基础设施 - **已完成**
- [x] **Astro 5.x**: 核心框架已升级到最新稳定版。
- [x] **SSR 支持**: `astro.config.mjs` 设置为 `output: 'server'`，支持动态预览和分析。
- [x] **别名配置**: Vite 别名 `~` 指向 `/src` 已配置。
- [x] **集成**: `solidjs`, `tailwind`, `mdx` 集成已正确配置。

### Phase 2: 国际化 (i18n) - **已完成**
- [x] **实现方案**: 自定义 `src/i18n.ts` 结合 `i18next` 实现，支持服务端和客户端同构。
- [x] **语言包**: 完整的 `zh-cn.json` 和 `en.json`。
- [x] **原生路由**: 使用 Astro 的 `i18n` 路由配置，自动处理 `/[lang]/`。

### Phase 3 & 4: 页面与路由迁移 - **已完成**
- [x] **核心页面**: `index`, `cdn`, `analyze`, `online-split`, `showcase`, `article` 已全部迁移至 Astro 页面。
- [x] **字体详情页**: `/fonts/[font]/[name].astro` 深度优化，大部分组件转换为 Astro 以提升性能。
- [x] **Islands**: 交互组件（如 `SearchBox`, `WASMSplit`, `TextWriter`）按需使用 `client:*` 指令。

### Phase 5: 静态资源处理 - **已完成**
- [x] **CDN 引用**: 全局使用 `__CDN__` 变量引用外部资源，减少站点体积。

### Phase 6: 样式迁移 - **已完成**
- [x] **Tailwind**: 全面采用 Tailwind CSS。
- [x] **Less 移除**: 已彻底移除所有 `.less` 文件，改为原子化 CSS 或 `.css`。

### Phase 7: 关键功能模块 - **已完成**
- [x] **MDX 增强**: 配置了 `remarkMdxToc`, `remarkFrontmatter`, `remarkMdxFrontmatter`, `remarkHeadId`, `Prism` 等插件。
- [x] **ECharts**: 封装了 `ECharts.tsx` 通用组件，支持服务端和客户端渲染。
- [x] **WASM**: 字体分割 WASM 模块在 Astro 环境下运行正常。

### 验收结果: **全部通过**
项目已成功迁移至 Astro 架构，性能和开发体验均得到显著提升。

---

## 预估工作量

| 阶段                 | 预估时间       |
| -------------------- | -------------- |
| 基础设施搭建         | 2-4 小时       |
| 国际化迁移           | 2-4 小时       |
| 布局迁移             | 2-4 小时       |
| 页面迁移（嵌入组件） | 8-12 小时      |
| API 迁移             | 1-2 小时       |
| 样式配置             | 1-2 小时       |
| 测试调试             | 4-8 小时       |
| **总计**             | **20-36 小时** |

**相比重写方案节省约 50% 时间**

---

## 参考资料

- [Astro 文档](https://docs.astro.build)
- [Astro Islands](https://docs.astro.build/en/core-concepts/islands/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [astro-intl](https://github.com/josh-misare/astro-intl)
