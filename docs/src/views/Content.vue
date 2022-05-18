<script setup lang="ts">
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
const log = (log: string) => console.log(log)
</script>

<template>
    <div
        class="grid grid-flow-row grid-cols-6 gap-8 lg:gap-12 p-8 md:grid-cols-12 flex-grow overflow-y-auto justify-items-center">
        <lazy-component v-for="(font, index) in store.fonts" :key="font.name" preload="1.5"
            class="col-span-6 w-full sm:w-3/4 md:w-11/12 lg:col-span-4 lg:w-full xl:col-span-3 h-56"
            @click="() => jumpToFontDetail(index, 'font')" @show="log(font.name)">
            <Card :font="font" :index="index" :config="store.config" class="h-full" @open="jumpToFontDetail"></Card>
        </lazy-component>
    </div>
</template>
