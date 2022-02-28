<script setup lang="ts">
</script>

<template>
    <div class="Icon flex">
        <slot></slot>
    </div>
</template>

<style>
@import url("https://cdn.jsdelivr.net/gh/KonghaYao/chinese-free-web-font-storage/css/Material Icons.css");
.Icon {
    user-select: none;
    cursor: pointer;
    width: 1em;
    height: 1em;
    font-family: "Material Icons";
}
</style>
