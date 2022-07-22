<template>
  <div
    class="stroke-current"
    @click="$emit('click', name)"
  >
    <component
      :class="iconClass"
      v-bind:is="name"
    ></component>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  iconClass: String,
  name: String,
});
</script>
