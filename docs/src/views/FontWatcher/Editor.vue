<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useGlobalStore } from '../globalStore'
import Icon from '../../components/Icon.vue';
import ListItem from '../../components/list-item.vue';
import { copy } from './copy'
import { router } from '../../routes';

const store = useGlobalStore()
const route = useRoute()
const reset = () => {
    store.show.type = route.meta.type as string || 'font'
    const fontIndex = store.findFontIndex(route.params.fontName as string)
    store.WatchFont(fontIndex, store.show.type)

}
onMounted(() => { reset(); resetData() })

const linkTag = ref('')
const CssUrl = ref('')
const resetData = () => {
    CssUrl.value = store.config.root + store.getEditingFont()?.url
    linkTag.value = `<link rel="stylesheet" href="${CssUrl.value}">`;

}

watch(() => store.choose.fontIndex, resetData)
const fontSize = ref(48)
const testText = ref(store.config.test)
const goBackToFont = () => {
    router.push(`/font/${store.fontDetail?.name}/font`)
}
</script>

<template>
    <div class="Font-Q divide-y divide-solid select-none text-2xl w-3/4">
        <div class="Font-Q py-4 flex justify-between">
            <span>{{ store.fontDetail!.name }}</span>
            <Icon class="text-2xl pl-4 text-red-400" @click="goBackToFont">cancel</Icon>
        </div>
        <ListItem>
            <div class="flex">
                <span>CSS 样式复制</span>
                <Icon
                    class="bg-green-400 text-white rounded-full w-6 h-6"
                    @click="copy(linkTag)"
                >content_copy</Icon>
            </div>
            <template v-slot:detail>
                <div class="select-text text-sm text-left bg-gray-100 py-2 px-4">{{ linkTag }}</div>
            </template>
        </ListItem>

        <ListItem>
            <div class="flex">
                <span>CSS 文件地址复制</span>
                <Icon
                    class="bg-green-400 text-white rounded-full w-6 h-6"
                    @click="copy(CssUrl)"
                >content_copy</Icon>
            </div>
            <template v-slot:detail>
                <div class="select-text text-sm text-left bg-gray-100 p-2 px-4">{{ CssUrl }}</div>
            </template>
        </ListItem>
        <ListItem :open="true">
            <div class="flex">
                <span>字体测试器</span>
            </div>
            <template v-slot:detail>
                <div class="flex flex-col border-t py-4">
                    <div>可以自行输入想要的字来查看效果哦！</div>
                    <div class="flex items-center mx-4">
                        <input class="flex-grow m-4" type="range" v-model="fontSize" />
                        <label>{{ fontSize }}px</label>
                    </div>
                    <textarea
                        class="ring-1 ring-red-400 rounded-md"
                        v-model="testText"
                        :style="{
                            fontFamily: store.getEditingFont()!.fontFamily,
                            fontWeight: store.getEditingFont()!.fontWeight || 'normal',
                            fontSize: fontSize + 'px',
                            lineHeight: '1.3em',
                            resize: 'none'
                        
                        }"
                    ></textarea>
                    <link rel="stylesheet" :href="CssUrl" />
                </div>
            </template>
        </ListItem>
    </div>
</template>

<style scoped>
</style>
