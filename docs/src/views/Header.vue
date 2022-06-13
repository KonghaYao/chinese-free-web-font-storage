<script setup lang="ts">

</script>

<template>
    <div class="flex flex-row p-4 bg-gray-800 text-white select-none">
        <div class="text-4xl Font-T">江夏尧的字体仓库</div>
        <div class="flex-grow overflow-y-auto overflow-x-hidden flex px-8">
            <router-link :to="{ name: 'Home' }">中文字体</router-link>
            <router-link to="/material-icons">Material Icon</router-link>

        </div>
        <div class="Font-Q">纵享中文字体之美</div>
    </div>
</template>

<style scoped>
/* 修正字体大小 */
.Font-T {
    line-height: 1rem;
}
</style>
