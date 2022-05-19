<script setup lang="ts">
import { ref } from 'vue';
import { useGlobalStore } from '../globalStore'
const store = useGlobalStore()
const code = ref('')
store.preloadLicense(store.choose.fontIndex).then((license) => {
    code.value = license
})

</script>

<template>
    <div class="p-4 md:w-3/4 flex-grow text-left whitespace-pre-wrap overflow-y-auto">
        <div>{{ code }}</div>
    </div>
</template>
