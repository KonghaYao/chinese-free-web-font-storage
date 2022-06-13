<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getIconList } from './getIconList'
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


onMounted(async () => {
    allIcons.value = await getIconList()
})
</script>

<template>
    <div class="flex-grow h-full w-full flex flex-col">
        <div class=" flex-shrink w-full flex  bg-white">
            <div v-for="item in AllIconType" class="p-2 m-2 cursor-pointer rounded-lg"
                :class="[selectFont === item && 'bg-gray-100']" @click="load(item)">
                {{ item }}
            </div>
        </div>
        <div class="flex-grow overflow-auto flex ">
            <div class="flex overflow-auto  flex-col flex-none">
                <div :class="[selectedType === undefined && 'bg-gray-200']" class="p-1 rounded-lg m-2"
                    @click="selectedType = undefined"> All
                </div>
                <div :class="[selectedType === cate[0] && 'bg-gray-200']" class="p-1 rounded-lg m-2"
                    v-for="cate in allIcons" @click="selectedType = cate[0]"> {{ cate[0] }} </div>
            </div>
            <div class="flex-grow overflow-auto">

                <div class="flex flex-wrap h-fit">
                    <div class="h-fit" v-for="icon in showingIcons" style="content-visibility: auto;">
                        <div :class="[className]" class=" p-1 text-lg m-1 cursor-pointer hover:bg-gray-50"
                            :title="icon">
                            {{ icon }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>