<template>
  <button
    class="text-white bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-secondary-300"
  >
    <RouterLink
      v-if="to"
      :to="to"
    >
      <slot></slot>
    </RouterLink>

    <slot v-else></slot>
  </button>
</template>

<script setup lang="ts">
defineProps({
  to: {
    type: String,
    default: '',
  },
})
</script>
