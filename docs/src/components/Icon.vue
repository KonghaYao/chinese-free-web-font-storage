

<template>
    <div class="Icon flex text-base items-center justify-center">
        <slot></slot>
    </div>
</template>

<style scoped>
@import url("https://fastly.jsdelivr.net/npm/@fontsource/material-icons@4.5.4/index.css");

.Icon {
    user-select: none;
    cursor: pointer;
    font-family: "Material Icons";
}
</style>
