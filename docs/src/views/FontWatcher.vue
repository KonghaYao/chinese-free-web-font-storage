<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useGlobalStore } from './globalStore'
import Icon from '../components/Icon.vue';
const store = useGlobalStore()
const chooseCSS = (index: number) => { }
const reset = () => {
    const route = useRoute()
    store.show.type = route.params.type as string || 'font'
    const fontIndex = store.findFontIndex(route.params.fontName as string)
    store.WatchFont(fontIndex, store.show.type)
}
onMounted(reset)
const backToHome = () => {

}
</script>

<template>
    <nav class="flex flex-col" v-if="store.fontDetail">
        <div v-if="store.show.type === 'font'">
            <Icon @click="backToHome">close</Icon>
            <h4 class="Font-Q text-2xl pb-4 mb-4 border-b-2">字体名称：{{ store.fontDetail!.name || '' }}</h4>
            <div class="flex flex-col flex-grow items-center">
                <div
                    v-for="(item, index) in store.fontDetail!.css || []"
                    :key="item.fontFamily"
                    class="w-3/4 ring-1 p-6 ring-teal-300/50 rounded-lg overflow-hidden flex flex-col justify-start bg-white divide-y divide-double"
                >
                    <!--  字体信息 -->
                    <div
                        class="font-light w-full flex justify-start items-baseline text-sm pb-2 mb-2 divide-x-2"
                    >
                        <span class="px-2">字体名称：{{ item.fontFamily }}</span>

                        <span class="px-2">字重：{{ item.fontWeight || "normal" }}</span>
                    </div>
                    <div class="relative">
                        <!-- 字符展示 -->
                        <div
                            class="text-2xl pt-4 text-left"
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
                        <!-- 选择按钮 -->
                        <div
                            class="absolute right-0 top-0 h-full w-full flex flex-row-reverse items-center"
                        >
                            <div
                                class="text-lg font-bold w-5/6 pr-4 from-transparent to-white bg-gradient-to-r float-right"
                                @click="chooseCSS(index)"
                            >
                                <div
                                    class="float-right px-2 py-2 rounded-md text-teal-400 h-fit cursor-pointer hover:bg-teal-200/50 flex items-center"
                                >
                                    <Icon>add</Icon>
                                    <div>选择字体</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="store.show.type === 'license'">
            <Icon @click="backToHome">close</Icon>
            <h4 class="card-name">字体名称：{{ store.fontDetail!.name ?? '' }}</h4>
            <div class="flex-grow" style="white-space: pre-wrap; overflow: scroll">
                <div>{{ store.choose.license }}</div>
            </div>
        </div>
    </nav>
</template>

<style scoped>
</style>
