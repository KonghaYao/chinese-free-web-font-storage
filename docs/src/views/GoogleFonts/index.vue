<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import copy from 'copy-to-clipboard'
import { selectDefPreviewText } from './defPreviewLanguages'

import "wc-spinners/dist/atom-spinner.js";
type FontMetaData = {
    "fontId": string,
    "fontName": string,
    "subsets": string[],
    "weights": number[],
    "styles": string[],
    "defSubset": string,
    "variable": boolean,
    "lastModified": string,
    "version": string,
    "category": string,
    "source": string,
    "license": string,
    "type": string
}

/* 获取所有字体的列表 */
const getFontList = async () => {
    const datalist = await fetch("https://api.fontsource.org/fontlist", { cache: "force-cache" }).then(res => res.json())
    return Object.entries(datalist).filter(([_, key]) => {
        return key === 'google'
    }).map(i => i[0])
}
const genURL = (name: string) => {
    return `https://fastly.jsdelivr.net/npm/@fontsource/${name}/index.css`
}
const fontList = ref<{ name: string, show: boolean }[]>([])

const container = ref<HTMLElement>()
const filterText = ref('')
const createFilter = () => {
    if (filterText) {
        const reg = new RegExp(filterText.value.replace(/\s/g, '[ |-]'), 'i')
        fontList.value = fontList.value.map(i => {
            const show = reg.test(i.name)
            if (show !== i.show) i.show = show
            return i
        })
    } else {
        fontList.value = fontList.value.map(i => {
            i.show = true
            return i
        })
    }
    container.value!.dispatchEvent(new Event('scroll'))
}

/* 用于存放 metadata 的响应式空间 */
const fontData = reactive<Record<string, FontMetaData>>({})

const getMetaData = async (name: string) => {
    const data: FontMetaData = await fetch(`https://fastly.jsdelivr.net/npm/@fontsource/${name}/metadata.json`).then(res => res.json())
    fontData[name] = data
}


onMounted(async () => {
    fontList.value = (await getFontList()).map(i => {
        return { name: i, show: true }
    })
})
const jumpTo = (url: string) => {
    window.open(url)
}
</script>

<template>
    <div class="flex-grow h-full w-full flex flex-col Font-E">
        <header class=" flex-shrink w-full flex  bg-white justify-between items-end">

            <input class="p-1 my-1 mx-2 Font-Q" v-model="filterText" placeholder="请输入搜索关键词" @input="createFilter" />
            <div class="Font-Q text-sm">共 {{ fontList.reduce((col, cur) => { return cur.show ? col + 1 : col }, 0) }} 字体
            </div>
            <div class="text-sm text-gray-400 Font-Q">
                字体来源为 <a href="https://fonts.google.com">Google Fonts</a> 和 <a
                    href="https://fontsource.org/">FontSource</a>
            </div>
        </header>
        <div class="grid grid-flow-row grid-cols-6 gap-8 lg:gap-12 p-8 md:grid-cols-12 flex-grow overflow-y-auto justify-items-center"
            ref="container">

            <!-- 每个卡片 -->
            <lazy-component v-for="({ name: font, show }) in fontList" :key="font" preload="1.5"
                class="col-span-6 w-full sm:w-3/4 md:w-11/12 lg:col-span-4 lg:w-full xl:col-span-3 h-56 bg-white p-2 drop-shadow-xl shadow-gray-50 rounded-2xl"
                @show="getMetaData(font)" :style="fontData[font] && {
                    fontFamily: fontData[font].fontName
                }" v-show="show">
                <div class="h-full flex flex-col " v-if="fontData[font]" style="content-visibility: auto;">
                    <header class="font-sans text-xl font-bold py-2 flex items-center justify-around">
                        <div>
                            {{ font }}
                        </div>
                        <div class="text-xs h-fit bg-green-400 text-white px-2">
                            {{ fontData[font].category }}
                        </div>
                    </header>

                    <!-- 测试字体 -->
                    <main class="text-2xl">{{ selectDefPreviewText(fontData[font].fontId,
                            fontData[font].defSubset)
                    }}</main>
                    <div class="flex-grow"></div>

                    <!-- 卡片下方的链接 -->
                    <footer class="flex justify-between mx-4">
                        <div class="bg-lime-400 text-white px-2">
                            {{ fontData[font].lastModified }}
                        </div>
                        <div class="material-icons cursor-pointer text-xs" @click="copy(genURL(font))">content_copy
                        </div>
                        <div class="material-icons cursor-pointer text-xs" @click="jumpTo(fontData[font].license)">
                            balance</div>
                    </footer>
                    <link rel="stylesheet" :href="genURL(font)">
                </div>
                <div v-else class="flex justify-center items-center h-full w-full ">
                    <atom-spinner class="h-24 w-24"></atom-spinner>
                </div>
            </lazy-component>
        </div>
    </div>
</template>