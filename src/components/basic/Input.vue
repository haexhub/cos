<template>
  <div class="flex-col py-1 text-slate-200">
    <div class="p-1 rounded text-sm ">{{ title }}</div>
    <input
      :type="type"
      :value="modelValue"
      class="bg-background p-1.5 rounded w-full"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String,

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