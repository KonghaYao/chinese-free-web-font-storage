<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

import LayaComponent from "lazy-load-vue3/src/LazyComponent";
import Icon from "../components/Icon.vue";
type FontDetail = {
    "name": string,
    "css":
    {
        "url": string,
        "fontFamily": string
        fontWeight?: "bolder" | "bold" | "normal"
    }[]
    ,
    "license": {
        "link": string
    }
}
const fonts = reactive([] as Array<FontDetail>)
const config = reactive({
    root: "https://cdn.jsdelivr.net/gh/KonghaYao/chinese-free-web-font-storage/build/",
    test: "与之斯部他行出不上公成地会个时学了后日月以和有大于人国中是为在一年的",
})
const choose = reactive({
    fontIndex: 0,
    license: "",
    cssIndex: 0,
})
const show = reactive({ overlay1: false, fontDetail: "font", overlay2: false, showFontSize: 16 })
onMounted(() => {
    fetch("./src/assets/fonts.json")
        .then((res) => res.json())
        .then((res) => {
            fonts.push(...res.map((i: FontDetail) => {
                // return { ...i, fontFamily: `'${i.fontFamily}'` };
                return i
            }));
        });
})
const chooseFont = (index: number, type: string) => {
    choose.fontIndex = index;
    show.fontDetail = type;
    show.overlay1 = true;
    choose.cssIndex = 0;
    if (type === "license") getLicense(index);
}
const getLicense = async (index: number) => {
    // $toasted.show("加载文件中", { duration: 1000 });
    const fontDetail = fonts[index]
    const license = await fetch(config.root + fontDetail.license.link).then(
        (res) => res.text()
    );
    choose.license = license;
}
const fontLink = (src: string) => {
    return src;
}
</script>

<template>
    <div
        class="grid-flow-row grid-cols-6 px-4 grid h-full overflow-y-auto md:grid-cols-12 justify-items-center"
    >
        <LayaComponent
            v-for="(font, index) in fonts"
            :key="font.name"
            class="col-span-6 w-full sm:w-2/3 md:w-5/6 lg:col-span-4 xl:col-span-3"
            @click="() => chooseFont(index, 'font')"
            :preLoad="0.1"
            :lazy-key="font.name"
        >
            <div
                class="flex flex-col m-4 select-none py-4 shadow bg-white hover:shadow-lg transition-shadow duration-300"
            >
                <div
                    class="Font-Q flex justify-between items-center bg-amber-50 px-4 transition-colors duration-500 hover:bg-purple-500 hover:text-white"
                >
                    <h4 class="text-lg">{{ font.name }}</h4>
                    <div class="grid grid-flow-col gap-4 p-2 h-full">
                        <Icon @click="() => chooseFont(index, 'font')">translate</Icon>
                        <Icon @click.stop="() => chooseFont(index, 'license')">balance</Icon>
                    </div>
                </div>
                <div
                    class="flex-grow p-4 text-base"
                    :style="{
                        fontFamily: font.css[0].fontFamily,
                        fontWeight: font.css[0].fontWeight ?? 'normal'
                    }"
                >
                    {{ config.test }}
                    <link
                        rel="stylesheet"
                        :href="fontLink(config.root + font.css[0].url)"
                    />
                </div>
            </div>
        </LayaComponent>
    </div>
</template>

<style scoped>
</style>
