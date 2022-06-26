// ! 在 worker 中不能够使用 import map
import {
    Compiler,
    sky_module,
    PluginLoader,
} from "https://fastly.jsdelivr.net/npm/rollup-web@4.1.4/dist/index.js";
// import {
//     Compiler,
//     sky_module,
//     PluginLoader,
// } from "../rollup-web/dist/index.js";
// 导入各种插件
// 导入各种插件
import typescript from "https://esm.sh/@babel/preset-typescript";

const [
    { default: json },
    { default: alias },
    { postcss },
    { vue },
    { babelCore },
] = await PluginLoader.loads(
    "plugin-json",
    "plugin-alias",
    "postcss",
    "vue3",
    "babel.core"
);

const CDN = globalThis.location.origin + "/docs/";

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
        }),
        postcss({
            filter() {
                return true;
            },
        }),
        // css(),
        vue({}),
        sky_module({
            cdn: (name) => {
                if (name.endsWith("#origin")) {
                    return `https://fastly.jsdelivr.net/npm/${name}`;
                } else if (!name.endsWith("/+esm")) {
                    return `https://fastly.jsdelivr.net/npm/${name}/+esm`;
                }
            },
            rename: {
                pinia: "pinia@2.0.11/dist/pinia.esm-browser.js#origin",
                "vue-router":
                    "vue-router@4.0.12/dist/vue-router.esm-browser.js#origin",
                "@vue/devtools-api": "@vue/devtools-api/+esm",
                vue: "vue@3.2.25/dist/vue.runtime.esm-browser.js#origin",
            },
        }),
        {
            resolveId(thisFile) {
                if (thisFile.startsWith("http")) {
                    return thisFile;
                } else if (thisFile.endsWith(".png")) {
                    const id = new URL(thisFile, CDN).toString();
                    console.warn(id);
                    return {
                        external: true,
                        id,
                    };
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
    useDataCache: {},
});

compiler.useWorker();
