/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
// 这里写全局的 CDN 模块定义转接
declare module "https://cdn.jsdelivr.net/npm/@konghayao/cn-font-split@4.3.3/dist/browser/index.js" {
    export * from "@konghayao/cn-font-split/dist/browser/index.d.ts";
}
