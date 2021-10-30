Vue.use(window.Toasted);
import copy from "./copy.js";
new Vue({
    el: "#app",
    data() {
        return {
            fonts: [],
            config: {
                test: "与之斯部他行出不上公成地会个时学了后日月以和有大于人国中是为在一年的",
            },
            choose: {
                fontIndex: 0,
                license: "",
                cssIndex: 0,
            },
            show: { overlay1: false, fontDetail: "font", overlay2: false },
        };
    },
    computed: {
        codeTemplate() {
            return `<link rel="stylesheet" href="${this.chosenFont.url}">`;
        },
        chosenFont() {
            try {
                return this.fontDetail.css[this.choose.cssIndex];
            } catch (e) {
                return {};
            }
        },
        fontDetail() {
            return this.fonts[this.choose.fontIndex] || {};
        },
    },
    mounted() {
        fetch("./fonts.json")
            .then((res) => res.json())
            .then((res) => {
                this.fonts = res.map((i) => {
                    return { ...i, fontFamily: `'${i.fontFamily}'` };
                });
            });
    },
    methods: {
        chooseFont({ index, type }) {
            this.choose.fontIndex = index;
            this.show.fontDetail = type;
            this.show.overlay1 = true;
            this.choose.cssIndex = 0;
            if (type === "license") this.getLicense(index);
        },
        copy(text) {
            copy(text).then((res) => {
                if (!res) {
                    this.$toasted.show("复制完成", {
                        duration: 1000,
                    });
                }
            });
        },
        chooseCSS(index) {
            this.show.overlay2 = true;
            this.choose.cssIndex = index;
        },
        async getLicense(index) {
            this.$toasted.show("加载文件中", { duration: 1000 });
            const license = await fetch(this.fontDetail.license.link).then(
                (res) => res.text()
            );

            this.choose.license = license;
        },
    },
});
