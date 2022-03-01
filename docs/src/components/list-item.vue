<script setup lang="ts">
import { ref } from 'vue';
import Icon from './Icon.vue';

const { open = false } = defineProps<{ open?: boolean }>()

const isOpened = ref(open)
const toggle = () => {
    isOpened.value = !isOpened.value
}
</script>

<template>
    <div class="flex flex-col py-2">
        <div class="w-full flex justify-between items-center">
            <slot></slot>
            <Icon @click="toggle" class="p-4 w-8 h-8 text-2xl">
                {{
                    isOpened ? "arrow_drop_up" : "arrow_drop_down_circle"
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
