<template>
    <div
        class="flex flex-col m-4 min-h-fit rounded-2xl select-none py-4 shadow-lg bg-white duration-300 shadow-gray-200  transition-transform">
        <div class="Font-Q flex justify-between items-center bg-amber-50 px-4 duration-500">
            <h4 class="text-lg">{{ font.name }}</h4>
            <div class="grid grid-flow-col gap-4 p-2 h-full">
                <Icon @click="$emit('open', index, 'font')">translate</Icon>
                <Icon @click="$emit('open', index, 'license')">balance</Icon>
            </div>
        </div>
        <div class="flex-grow p-4 flex items-center text-xl" :style="{
            fontFamily: font.css[0].fontFamily + ',system-ui',
            fontWeight: font.css[0].fontWeight ?? 'normal'
        }">
            {{ config.test }}
            <teleport to="body">
                <link rel="stylesheet" :href="fontLink(config.root + font.css[0].url)" />
            </teleport>
        </div>
    </div>
</template>
<script setup lang="ts">
import Icon from "./Icon.vue";
import { FontDetail } from '../types';
import { ref } from "vue";
const fontLink = (src: string) => {
    return src;
}
const prepared = ref(false)
const $emit = defineEmits<{
    (event: "open", index: number, type: string): void
}>()
const { font, config, index } = defineProps<{
    font: FontDetail,
    index: number
    config: { root: string, test: string }
}>()
</script>