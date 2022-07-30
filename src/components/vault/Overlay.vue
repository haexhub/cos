<template>
  <transition enter-active-class="scale-in-center" leave-active-class="scale-out-center">
    <div v-show="appStore.getState().isOverlayVisible" tabindex="-1" class="
      absolute 
      transition-all
      duration-1000
      bg-transparent
      top-0
      left-0
      py-1/2
      xs:p-0
      sm:px-1/6
      md:(px-1/5 py-40)
      lg:(px-1/4 py-60)
      h-full
      w-full
    " ref="overlay" @keyup.esc="appStore.hideOverlay()">

      <div class="
      bg-background-overlay
      rounded-lg 
      p-2
      min-w-100
      max-w-170
      ring
      m-2
    ">
        <slot />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { onBeforeUpdate, ref } from "vue";
import { appStore } from "../../store/app-store";

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
  lastState.value = props.modelValue;
};

onBeforeUpdate(() => {
  if (props.modelValue) show();
  else close();
});
</script>