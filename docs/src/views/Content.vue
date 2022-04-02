<script setup lang="ts">
//TODO lazy-component 尚未实现
import { useRouter } from "vue-router";

import Card from '../components/Card.vue';
import { useGlobalStore } from './globalStore'
const store = useGlobalStore()
const router = useRouter()
const jumpToFontDetail = (index: number, type: string) => {
    store.WatchFont(index, type)
    if (store.fontDetail) {
        router.push(`/font/${store.fontDetail?.name}/${type}`)
    }
}

</script>

<template>
    <lazy-component
        class="grid grid-flow-row grid-cols-6 gap-8 lg:gap-2 p-8 md:grid-cols-12 h-full overflow-y-auto justify-items-center"
    >
        <div
            v-for="(font, index) in store.fonts"
            :key="font.name"
            class="col-span-6 w-full sm:w-3/4 md:w-11/12 lg:col-span-4 lg:w-full xl:col-span-3"
            @click="() => jumpToFontDetail(index, 'font')"
            :preLoad="0.1"
        >
            <Card
                :font="font"
                :index="index"
                :config="store.config"
                class="h-full"
                @open="jumpToFontDetail"
            ></Card>
        </div>
    </lazy-component>
</template>

<style scoped>
</style>
