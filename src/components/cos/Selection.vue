<template>
  <select
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:hover:ring-primary-500"
    :value="modelValue" @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)">

    <slot />
  </select>
</template>

<script setup lang="ts">
defineProps({
  modelValue: String || Number
})

defineEmits(["update:modelValue"])
</script>