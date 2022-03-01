<script setup lang="ts">
import { useGlobalStore } from '../globalStore'
const store = useGlobalStore()
</script>

<template>
    <div class="p-4 md:w-3/4 flex-grow text-left whitespace-pre-wrap overflow-y-auto">
        <div>{{ store.choose.license }}</div>
    </div>
</template>

<style scoped>
</style>
