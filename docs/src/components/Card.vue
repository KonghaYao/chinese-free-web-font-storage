<template>
    <div
        class="flex flex-col m-4 min-h-fit rounded-2xl select-none py-4 shadow bg-white hover:shadow-lg transition-shadow duration-300"
    >
        <div
            class="Font-Q flex justify-between items-center bg-amber-50 px-4 shadow shadow-orange-100 transition-colors duration-500 hover:bg-purple-500 hover:text-white"
        >
            <h4 class="text-lg">{{ font.name }}</h4>
            <div class="grid grid-flow-col gap-4 p-2 h-full">
                <Icon @click="$emit('open', index, 'font')">translate</Icon>
                <Icon @click.stop="$emit('open', index, 'license')">balance</Icon>
            </div>
        </div>
        <div
            class="flex-grow p-4 flex items-center text-xl"
            :style="{
                fontFamily: font.css[0].fontFamily,
                fontWeight: font.css[0].fontWeight ?? 'normal'
            }"
        >
            {{ config.test }}
            <link rel="stylesheet" :href="fontLink(config.root + font.css[0].url)" />
        </div>
    </div>
</template>
<script setup lang="ts">
import Icon from "./Icon.vue";
import { FontDetail } from '../types';
const fontLink = (src: string) => {
    return src;
}
const $emit = defineEmits<{
    (event: "open", index: number, type: string): void
}>()
const { font, config, index } = defineProps<{
    font: FontDetail,
    index: number
    config: { root: string, test: string }
}>()
</script>