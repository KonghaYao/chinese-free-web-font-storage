new Vue({
    el: "#app",
    data() {
        return {
            fonts: [],
            config: {
                test: "与之斯部他行出不上公成地会个时学了后日月以和有大于人国中是为在一年的",
            },
        };
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
    methods: {},
});
