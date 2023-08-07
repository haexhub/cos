<template>
  <input :type="type"
    class="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white sm:text-sm rounded-lg hover:border-primary-600  block w-full p-2.5 dark:placeholder-gray-400 dark:hover:border-primary-300 " />
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: [String, Number],
  },
  placeholder: String,
  label: String,
  type: {
    type: String,
    default: "text",
  },
});
</script>