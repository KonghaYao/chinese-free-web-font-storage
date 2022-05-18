// 导入打包产物
import {
    useRollup,
    web_module,
    sky_module,
    ModuleEval,
    DynamicServer,
} from "rollup-web";

// 导入各种插件
import { initBabel, babel } from "rollup-web/dist/plugins/babel.js";
import { vue } from "rollup-web/dist/plugins/vue3.js";
import json from "@rollup/plugin-json";

// 构建一个给 Solid 内部的 打包信息渠道
import mitt from "mitt";
const RollupHub = mitt();
globalThis.RollupHub = RollupHub;

import postcss from "https://esm.sh/postcss";
import {
    drawDependence,
    MapperStore,
} from "rollup-web/dist/plugins/drawDependence.js";
globalThis.MapperStore = MapperStore;

const isDev = () => globalThis.location.host.split(":")[0] === "127.0.0.1";
const CDN = isDev()
    ? globalThis.location.href
    : "https://fastly.jsdelivr.net/gh/konghayao/chinese-free-web-font-storage/index.bundless.html";

await initBabel();

const server = new DynamicServer("_import", CDN);
const config = {
    external: ["vue", "vue-router", "pinia"],
    // 直接采用 src 目录下的 index.ts 进行打包实验
    input: "./src/main.ts",
    output: {
        format: "es",
    },
    plugins: [
        json(),
        vue(),
        babel({
            babelrc: {
                presets: [
                    [
                        Babel.availablePresets["typescript"],
                        {
                            // 需要使用这种方式兼容 solid 配置
                            isTSX: true,
                            allExtensions: true,
                        },
                    ],
                ],
            },
            extensions: [".ts", ".js"],
            log(id) {
                console.log("%c babel ==> " + id, "color:blue");
            },
        }),

        web_module({
            root: CDN,
            // 本地打包
            extensions: [".vue", ".ts", ".js", ".json"],
            log(url) {
                console.log("%c Download ==> " + url, "color:green");
            },
        }),

        sky_module({
            cdn(name) {
                console.log("%c 默认CDN " + name, "color:purple");
                return `https://fastly.jsdelivr.net/npm/${name}/+esm`;
            },
            ignore: ["vue", "vue-router", "pinia"],
        }),
        // 这是一种异步导入方案，使用 全局的一个外置 Server 来保证代码的正确执行
        server.createPlugin({}),
        {
            name: "css",
            async load(id) {
                if (/\.css$/.test(id)) {
                    const text = await fetch(id).then((res) => res.text());
                    const css = await postcss().process(text);
                    return `
                    const link = document.createElement('style')
                    link.type="text/css"
                    link.innerHTML = \`${css}\`
                    document.head.appendChild(link)
               
                    `;
                }
            },
        },

        drawDependence({
            log(mapperTag, newestMapper) {
                RollupHub.emit(
                    "drawDependence",
                    {
                        nodeParts: newestMapper.getNodeParts(),
                        nodeMetas: newestMapper.getNodeMetas(),
                    },
                    newestMapper
                );
            },
            mapperTag: "default",
        }),
    ],
};
/** 需要在使用前注册一下这个server */
server.registerRollupPlugins(config.plugins);
const data = await useRollup(config);
await ModuleEval(data.output[0].code);
console.log("初始化打包完成");
