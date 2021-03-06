<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getIconList } from './getIconList'
import copy from 'copy-to-clipboard';
type IconType = 'normal' | "rounded" | "outlined" | "sharp" | "two-tone"
const AllIconType = ['normal', "rounded", "outlined", "sharp", "two-tone"] as const
const cssMap = {
    normal: "https://fastly.jsdelivr.net/npm/@fontsource/material-icons/index.css",
    rounded: "https://fastly.jsdelivr.net/npm/@fontsource/material-icons-rounded/index.css",
    outlined: "https://fastly.jsdelivr.net/npm/@fontsource/material-icons-outlined/index.css",
    sharp: "https://fastly.jsdelivr.net/npm/@fontsource/material-icons-sharp/index.css",
    "two-tone": "https://fastly.jsdelivr.net/npm/@fontsource/material-icons-two-tone/index.css",
}
const usingLink = ref<HTMLLinkElement | null>(null)
const selectFont = ref<IconType>('normal')
const className = computed(() => {
    if (selectFont.value !== 'normal') {
        return 'material-icons-' + selectFont.value
    } else {
        return 'material-icons'

    }
})
const load = (iconType: IconType) => {
    return new Promise(res => {
        const link = document.createElement("link")
        link.rel = 'stylesheet'
        link.href = cssMap[iconType]
        document.head.appendChild(link)
        link.onload = () => {
            res(true)
            selectFont.value = iconType
        }
        usingLink.value && usingLink.value.remove()
        usingLink.value = link
    })
}

// icon 数据存储
const allIcons = ref<[string, string[]][]>([])

// 选中的 icon 种类
const selectedType = ref<string | undefined>(undefined)

// 筛选出正在查看的 icon
const showingIcons = computed(() => {
    if (selectedType.value) {
        return allIcons.value.find(i => i[0] === selectedType.value)![1]
    } else {
        return allIcons.value.flatMap(i => i[1])
    }
})

const CopyIcon = (icon: string) => {
    copy(icon)
}
const CopyLink = () => {
    copy(cssMap[selectFont.value])
}
onMounted(async () => {
    allIcons.value = await getIconList()
})
</script>

<template>
    <div class="flex-grow h-full w-full flex flex-col Font-E">
        <header class=" flex-shrink w-full flex  bg-white">
            <div v-for="item in AllIconType" class="p-2 m-2 cursor-pointer rounded-lg"
                :class="[selectFont === item && 'bg-gray-100']" @click="load(item)">
                {{ item }}
            </div>
            <div class="flex-grow"> </div>
            <nav class="flex justify-center items-center">
                <div class="cursor-pointer flex items-center px-2" @click="CopyLink" title="复制 CSS 地址">
                    <div class="material-icons text-xs px-2">
                        content_copy
                    </div>
                    <div class="text-sm text-gray-400 ">
                        Copy CSS
                    </div>
                </div>
            </nav>
        </header>
        <div class="flex-grow overflow-auto flex ">
            <nav class="flex overflow-auto  flex-col flex-none cursor-pointer">
                <div :class="[selectedType === undefined && 'bg-gray-200']" class="p-1 rounded-lg m-2"
                    @click="selectedType = undefined"> All
                </div>
                <div :class="[selectedType === cate[0] && 'bg-gray-200']" class="p-1 rounded-lg m-2"
                    v-for="cate in allIcons" @click="selectedType = cate[0]"> {{ cate[0] }} </div>
            </nav>
            <main class="flex-grow overflow-y-auto overflow-x-hidden w-full h-full">

                <div class="flex flex-wrap  w-full justify-between">
                    <div v-for="icon in showingIcons">
                        <div :class="[className]" class=" p-1 text-lg m-1 cursor-pointer " :title="icon"
                            @click="CopyIcon(icon)">
                            {{ icon }}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>