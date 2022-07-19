<template>
  <input
    :type="type"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup lang="ts">
//import { defineProps } from "vue";

defineProps({
  type: {
    type: String,
    default: "text",
  },

  modelValue: {
    type: String || Number,
    default: "",
  },
});
</script>