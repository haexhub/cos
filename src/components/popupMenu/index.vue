<template>
  <div
    class="absolute z-10 bg-primary "
    :class="{ hidden: !visible }"
  >
    <nav
      id="context-menu"
      class="context-menu "
    >
      <slot />
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUpdated, onBeforeMount, onMounted } from "vue";
import { contextMenuStore } from "@/store/context-menu-store.ts";

const visible = ref(false);

onBeforeMount(async () => {
  try {
    await contextMenuStore.init();
  } catch (error) {
    console.log("ERROR popupMenu index ", error);
  }
});

onMounted(async () => {
  visible.value = await contextMenuStore.toggleOff();
});

const toggleOn = async () => {
  console.log("toggle contextmenu on");
  //await contextMenuStore.toggleOff();
  visible.value = await contextMenuStore.toggleOn();
};

const toggleOff = async () => {
  console.log("toggle contextmenu off");
  visible.value = await contextMenuStore.toggleOff();
};

watch(
  () => contextMenuStore.state.show,
  function () {
    console.log("watch contextmenu", contextMenuStore.state.show);
    if (!contextMenuStore.state.show) {
      visible.value = false;
    }
  }
);

defineExpose({ visible, toggleOn, toggleOff });
</script>

