<template>
  <div
    class="
      absolute 
      transition
      transition-all
      transform
      duration-1000
      bg-transparent
      top-0
      left-0
      py-1/2
      xs:p-0
      sm:px-1/6
      md:(px-1/4 py-40)
      lg:(px-1/3 py-60) 
    "
    :class="[
      width, 
      opacity, 
      heigth, 
      hidden
    ]"
    tabindex="-1"
    ref="overlay"
  >

    <div class="
      bg-background-overlay
      rounded-lg 
      p-2
      min-w-100
      max-w-164
    ">
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
const overlay = ref();
const lastState = ref(false);

const show = () => {
  hidden.value = "";

  setTimeout(() => {
    width.value = "w-full";
    heigth.value = "h-0";
    opacity.value = "opacity-100";

    if (lastState.value === false) {
      overlay.value.focus();
    }
    lastState.value = props.modelValue;
  }, 10);
};

const close = () => {
  width.value = "w-0";
  heigth.value = "h-0";
  opacity.value = "opacity-0";

  setTimeout(() => {
    hidden.value = "hidden";
  }, 500);
};

onBeforeUpdate(() => {
  if (props.modelValue) show();
  else close();
});
</script>