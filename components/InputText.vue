<template>
  <input :type="type" />
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
