<template>
  <div
    class="
      absolute 
      top-0 
      left-0
      transition
      transition-all
      duration-1000
      bg-transparent
      box-border
      px-0
      py-1/2
      md:(px-12 py-40)
      lg:(px-32 py-60)
    "
    :class="[
      width, 
      opacity, 
      heigth, 
      hidden
    ]"
  >
    <div class="bg-background-overlay rounded-lg p-2">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUpdate, ref } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const width = ref("w-0");
const heigth = ref("h-0");
const opacity = ref("opacity-0");
const hidden = ref("hidden");

const show = () => {
  hidden.value = "";
  setTimeout(() => {
    width.value = "w-full";
    heigth.value = "h-0";
    opacity.value = "opacity-100";
  }, 10);
};

const close = () => {
  width.value = "w-0";
  heigth.value = "h-0";
  opacity.value = "opacity-0";

  setTimeout(() => {
    hidden.value = "hidden";
  }, 1000);
};

onBeforeUpdate(() => {
  if (props.modelValue) show();
  else close();
});
</script>