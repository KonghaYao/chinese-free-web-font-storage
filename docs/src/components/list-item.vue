<script setup lang="ts">
import { ref } from 'vue';
import Icon from './Icon.vue';
const isOpened = ref(true)
const toggle = () => {
    isOpened.value = !isOpened.value
}
</script>

<template>
    <div class="flex flex-col py-4">
        <div class="w-full flex justify-between items-center">
            <slot></slot>
            <Icon @click="toggle" class="p-4">
                {{
                    isOpened ? "arrow_drop_up" : "arrow_drop_down"
                }}
            </Icon>
        </div>

        <div v-show="isOpened" class="pt-4">
            <slot name="detail"></slot>
        </div>
    </div>
</template>

<style scoped>
</style>
