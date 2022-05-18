<script setup lang="ts">
const title = '江夏尧的字体仓库'
</script>

<template>
    <div class="flex flex-row p-4 bg-gray-800 text-white select-none">
        <div class="text-4xl Font-T">{{ title }}</div>
        <div class="flex-grow overflow-y-auto overflow-x-hidden"></div>
        <div class="Font-Q">纵享中文字体之美</div>
    </div>
</template>

<style scoped>
/* 修正字体大小 */
.Font-T {
    line-height: 1rem;
}
</style>
