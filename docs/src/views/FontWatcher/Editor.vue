<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useGlobalStore } from '../globalStore'
import Icon from '../../components/Icon.vue';
import ListItem from '../../components/list-item.vue';
const store = useGlobalStore()
const route = useRoute()
const reset = () => {
    store.show.type = route.meta.type as string || 'font'
    const fontIndex = store.findFontIndex(route.params.fontName as string)
    store.WatchFont(fontIndex, store.show.type)
    console.log(store);
}
onMounted(() => { reset(); resetData() })

const linkTag = ref('')
const CssUrl = ref('')
const resetData = () => {
    CssUrl.value = store.config.root + store.getEditingFont()?.url
    linkTag.value = `<link rel="stylesheet" href="${CssUrl.value}">`;

}

watch(() => store.choose.fontIndex, resetData)
/** 复制文本函数 */
const copy = (Info: string) => {
    const el = document.createElement("textarea");
    el.value = Info;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    const selected =
        document.getSelection()!.rangeCount > 0
            ? document.getSelection()!.getRangeAt(0)
            : false;
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    if (selected) {
        document.getSelection()!.removeAllRanges();
        document.getSelection()!.addRange(selected);
    }

}
</script>

<template>
    <div class="Font-Q divide-y divide-solid m-2 p-2 select-none text-xl w-3/4">
        <div class="Font-Q p-4">选择字体</div>
        <ListItem>
            <div class="flex">
                <span>CSS 样式复制</span>
                <Icon @click="copy(linkTag)">content_copy</Icon>
            </div>
            <template v-slot:detail>
                <div class="select-text text-sm text-left bg-gray-100 py-2 px-4">{{ linkTag }}</div>
            </template>
        </ListItem>

        <ListItem>
            <div class="flex">
                <span>CSS 文件地址复制</span>
                <Icon @click="copy(CssUrl)">content_copy</Icon>
            </div>
            <template v-slot:detail>
                <div class="select-text text-sm text-left bg-gray-100 p-2 px-4">{{ CssUrl }}</div>
            </template>
        </ListItem>
        <ListItem>
            <div class="flex">
                <span>字体测试器</span>
                <Icon @click="copy(CssUrl)">content_copy</Icon>
            </div>
            <template v-slot:detail>
                <div class="select-text text-sm text-left bg-gray-100 p-2 px-4">{{ CssUrl }}</div>
            </template>
        </ListItem>
    </div>
</template>

<style scoped>
</style>
