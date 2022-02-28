// stores/counter.js
import { defineStore } from "pinia";
import { FontDetail } from "../types";
import fonts from "../assets/fonts.json";
export const useGlobalStore = defineStore("global", {
    state: () => {
        return {
            fonts: fonts as Array<FontDetail>,
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
