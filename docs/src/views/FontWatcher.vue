<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGlobalStore } from './globalStore'
import Icon from '../components/Icon.vue';
const store = useGlobalStore()
const router = useRouter()
const route = useRoute()

const reset = () => {
    store.show.type = route.meta.type as string || 'font'

    const fontIndex = store.findFontIndex(route.params.fontName as string)
    store.WatchFont(fontIndex, store.show.type)
}
onMounted(reset)
const backToHome = () => {
    router.push({ name: "Home" })
}
</script>

<template>
    <nav class="h-full" v-if="store.fontDetail">
        <div class="h-full overflow-hidden flex flex-col">
            <div class="select-none relative">
                <div
                    class="flex absolute h-full items-center justify-center cursor-pointer text-teal-400 font-bold"
                    @click="backToHome"
                >
                    <Icon class="text-xl px-4">arrow_back_ios_new</Icon>
                    <span>字体仓库</span>
                </div>
                <h4 class="Font-Q text-2xl py-2 border-b-2">字体名称：{{ store.fontDetail!.name || '' }}</h4>
            </div>
            <div class="flex flex-col flex-grow items-center pt-4 px-4 overflow-y-scroll bg-white">
                <router-view></router-view>
            </div>
        </div>
    </nav>
</template>

<style scoped>
</style>
