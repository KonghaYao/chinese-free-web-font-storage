<script setup lang="ts">
</script>

<template>
    <div class="Icon flex text-base items-center justify-center">
        <slot></slot>
    </div>
</template>

<style scoped>
@import url("https://cdn.jsdelivr.net/gh/KonghaYao/chinese-free-web-font-storage/css/Material Icons.css");
.Icon {
    user-select: none;
    cursor: pointer;
    font-family: "Material Icons";
}
</style>
