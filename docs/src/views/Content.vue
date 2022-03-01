<script setup lang="ts">

import LazyComponent from "lazy-load-vue3/src/LazyComponent";

import Card from '../components/Card.vue';
import { useGlobalStore } from './globalStore'
const store = useGlobalStore()

</script>

<template>
    <div
        class="grid-flow-row grid-cols-6 px-4 grid h-full overflow-y-auto md:grid-cols-12 justify-items-center"
    >
        <LazyComponent
            v-for="(font, index) in store.fonts"
            :key="font.name"
            class="col-span-6 w-full sm:w-2/3 md:w-5/6 lg:col-span-4 xl:col-span-3"
            @click="() => store.WatchFont(index, 'font')"
            :preLoad="0.1"
        >
            <Card :font="font" :index="index" :config="store.config" @open="store.WatchFont"></Card>
            <template #loading>
                <span>loading...</span>
            </template>
        </LazyComponent>
    </div>
</template>

<style scoped>
</style>
