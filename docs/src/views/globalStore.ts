// stores/counter.js
import { defineStore } from "pinia";
import { FontDetail } from "../types";

export const useGlobalStore = defineStore("global", {
    state: () => {
        return {
            fonts: [] as Array<FontDetail>,
            config: {
                root: "https://cdn.jsdelivr.net/gh/KonghaYao/chinese-free-web-font-storage/build/",
                test: "与之斯部他行出不上公成地会个时学了后日月以和有大于人国中是为在一年的",
            },
            fontDetail: null as null | FontDetail,
            show: {
                overlay1: false,
                overlay2: false,
                fontDetail: "font",
                showFontSize: 16,
            },
            choose: {
                fontIndex: 0,
                license: "",
                cssIndex: 0,
            },
        };
    },
    actions: {
        addFonts(fonts: FontDetail[]) {
            this.fonts.push(...fonts);
        },
        getFontByIndex(index: number) {
            return this.fonts[index];
        },
        /** 获取 git 仓库中的字体描述文件（推荐只加载一次） */
        async fetchFonts() {
            await fetch("./src/assets/fonts.json")
                .then((res) => res.json())
                .then((res) => {
                    this.addFonts(res as FontDetail[]);
                });
        },
        /** 打开面板进行查看 */
        async WatchFont(index: number, type: string) {
            this.choose.fontIndex = index;
            this.show.fontDetail = type;
            this.show.overlay1 = true;
            this.choose.cssIndex = 0;
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
