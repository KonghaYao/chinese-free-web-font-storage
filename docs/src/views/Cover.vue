<script setup lang="ts">
import { useGlobalStore } from './globalStore'
const store = useGlobalStore()
const chooseCSS = (index: number) => { }
</script>

<template>
    <nav class="Overlay flex flex-col z-1" v-show="store.show.overlay1">
        <div class="font-detail card" v-if="store.show.fontDetail === null">
            <div class="Icon close-btn flex" @click="store.show.overlay1 = false">close</div>
            <h4 class="card-name">字体名称：{{ store.fontDetail!.name || '' }}</h4>
            <div class="flex-grow font-families-wrap">
                <div
                    v-for="(item, index) in store.fontDetail!.css || []"
                    :key="item.fontFamily"
                    class="font-families"
                >
                    <div class="en-name">
                        {{ item.fontFamily }}
                        {{ item.fontWeight || "normal" }}
                    </div>
                    <div class="example">
                        <div
                            :style="{
                                fontFamily: item.fontFamily,
                                fontWeight: item.fontWeight || 'normal'
                            }"
                        >
                            {{ store.config.test }}
                            <link
                                rel="stylesheet"
                                :href="store.fontLink(store.config.root + item.url)"
                            />
                        </div>
                        <div class="font-sidebar flex">
                            <div class="text flex" @click="chooseCSS(index)">
                                <span class="Icon flex">add</span>
                                选择字体
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="font-detail card" v-if="store.show.fontDetail === 'license'">
            <div class="Icon close-btn flex" @click="store.show.overlay1 = false">close</div>
            <h4 class="card-name">字体名称：{{ store.fontDetail!.name ?? '' }}</h4>
            <div class="flex-grow" style="white-space: pre-wrap; overflow: scroll">
                <div>{{ store.choose.license }}</div>
            </div>
        </div>
    </nav>
</template>

<style scoped>
</style>
