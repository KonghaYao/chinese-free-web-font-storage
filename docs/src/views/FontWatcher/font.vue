<script setup lang="ts">
import { useGlobalStore } from '../globalStore'
import Icon from '../../components/Icon.vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const lookFont = (fontWeight: string = 'normal') => {
    if (store.fontDetail) {
        store.choose.fontWeight = fontWeight
        router.push(`/font/${store.fontDetail.name}/editor/${fontWeight}`)
    }
}
const store = useGlobalStore()
</script>

<template>
    <div
        v-for="(item) in store.fontDetail!.css || []"
        :key="item.fontFamily"
        class="w-full md:w-3/4 shadow-md p-4 m-2 md:m-4 lg:m-6 rounded-lg overflow-hidden flex flex-col flex-none justify-start divide-y divide-double"
    >
        <!--  字体信息 -->
        <div
            class="font-light w-full flex justify-start items-baseline text-sm pb-1 mb-1 divide-x-2 italic"
        >
            <span class="px-2">字体名称：{{ item.fontFamily }}</span>

            <span class="px-2">字重：{{ item.fontWeight || "normal" }}</span>
        </div>
        <div class="relative flex items-center pt-4 pb-2">
            <!-- 字符展示 -->
            <div
                class="text-2xl text-left"
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
            <div class="absolute right-0 top-0 h-full w-1/2 flex flex-row-reverse items-center">
                <div class="w-5/6 pr-4 from-transparent to-white bg-gradient-to-r float-right">
                    <div
                        class="text-lg font-bold float-right px-2 py-2 rounded-md text-teal-400 h-fit cursor-pointer hover:bg-teal-100/50 flex items-center"
                        @click="lookFont(item.fontWeight)"
                    >
                        <Icon>add</Icon>
                        <div>查看字体</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
