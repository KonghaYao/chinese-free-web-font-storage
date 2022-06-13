const CDN = globalThis.location.href;

import "https://fastly.jsdelivr.net/npm/systemjs@6.12.1/dist/system.min.js";
// 导入打包产物
import { Compiler, Evaluator, sky_module, PluginLoader } from "rollup-web";
import { vue } from "rollup-web/dist/plugins/vue3.js";
import { babelCore } from "rollup-web/dist/plugins/babel.core.js";

// 导入各种插件
import typescript from "https://esm.sh/@babel/preset-typescript";

const { default: json } = await PluginLoader.load("plugin-json");
const { default: alias } = await PluginLoader.load("plugin-alias");
const { css } = await PluginLoader.load("css");

const config = {
    plugins: [
        json(),
        alias({
            entries: [{ find: "@", replacement: "./" }],
        }),

        babelCore({
            babelrc: {
                presets: [
                    [
                        typescript,
                        {
                            // 需要使用这种方式兼容 solid 配置
                            isTSX: true,
                            allExtensions: true,
                        },
                    ],
                ],
            },
            extensions: [".ts"],
            log(id) {
                console.log("%cBabel typescript > " + id, "color:orange");
            },
        }),
        css(),
        vue({}),
        sky_module({
            cdn: (name) => `https://fastly.jsdelivr.net/npm/${name}/+esm`,
            rename: {
                pinia: "pinia@2.0.11/dist/pinia.esm-browser.js/+esm",
                "vue-router":
                    "vue-router@4.0.12/dist/vue-router.esm-browser.js",
                "@vue/devtools-api": "@vue/devtools-api/+esm",
                vue: "vue@3.2.25/dist/vue.runtime.esm-browser.js",
            },
        }),
        {
            resolveId(thisFile) {
                if (thisFile.startsWith("http")) {
                    return thisFile;
                }
            },
        },
    ],
    external: ["vue", "vue-router", "pinia"],
};

const compiler = new Compiler(config, {
    root: CDN,
    extensions: [".vue", ".ts", ".js", ".json"],
    log(url) {
        console.log("%cDownload " + url, "color:green");
    },
    // useDataCache: {},
});

const Eval = new Evaluator();
await Eval.createEnv({
    Compiler: compiler,
    root: CDN,
});
await Eval.evaluate("./src/main.ts");
