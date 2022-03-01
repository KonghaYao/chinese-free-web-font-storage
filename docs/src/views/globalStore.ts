// stores/counter.js
import { defineStore } from "pinia";
import { reactive } from "vue";
import { CssDetail, FontDetail } from "../types";
const fonts = reactive([] as FontDetail[]);
fetch(
    "https://cdn.jsdelivr.net/gh/KonghaYao/chinese-free-web-font-storage/fonts.json"
)
    .then((res) => res.json())
    .then((res) => {
        fonts.push(...res);
    });
export const useGlobalStore = defineStore("global", {
    state: () => {
        return {
            fonts,
            config: {
                root: "https://cdn.jsdelivr.net/gh/KonghaYao/chinese-free-web-font-storage/build/",
                test: "与之斯部他行出不上公成地会个时学了后日月以和有大于人国中是为在一年的",
            },
            show: {
                overlay2: false,
                type: "",
                showFontSize: 16,
            },
            choose: {
                fontIndex: -1,
                license: "",
                fontWeight: "normal",
                cssIndex: 0,
            },
        };
    },
    getters: {
        fontDetail(): null | FontDetail {
            const target = this.fonts[this.choose.fontIndex];
            return target ?? null;
        },
    },
    actions: {
        getEditingFont(): null | CssDetail {
            if (this.fontDetail) {
                const fontWeight = this.choose.fontWeight ?? "normal";
                const fontDetail = this.fontDetail!;
                return (
                    fontDetail.css.find((font) => {
                        return font.fontWeight === fontWeight;
                    }) || fontDetail.css[0]
                );
            }
            return null;
        },
        getFontByIndex(index: number) {
            return this.fonts[index];
        },
        findFontIndex(fontName: string) {
            fontName = decodeURIComponent(fontName);
            return this.fonts.findIndex((font) => {
                return font.name === fontName;
            });
        },
        /** 打开面板进行查看 */
        async WatchFont(index: number, type: string) {
            if (this.choose.fontIndex !== index) {
                this.choose.fontIndex = index;
                this.show.type = type;
                this.choose.cssIndex = 0;
            }
            if (type === "license") {
                const license = await this.preloadLicense(index);
                this.choose.license = license;
            }
        },
        /** 提前获取 License 文本 */
        async preloadLicense(index: number) {
            const fontDetail = this.getFontByIndex(index);
            return await fetch(this.config.root + fontDetail.license.link).then(
                (res) => res.text()
            );
        },
        fontLink(url: string) {
            return url;
        },
    },
});
