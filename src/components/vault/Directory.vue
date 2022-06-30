<template>
  <div>
    <button
      @click="emit('select', directory)"
      @contextmenu.prevent="openContextMenu"
    >
      {{ directory.name }}
    </button>

    <context-menu
      ref="contextMenuDOM"
      :class="[contextMenuStore.state.show ? '' : 'hidden']"
    >
      <context-menu-directory />
    </context-menu>

    <ul
      v-if="directory && directory.subdirectorys"
      class="p-l-2"
    >
      <li
        v-for="subdirectory in directory.subdirectorys"
        :key="subdirectory.id"
      >
        <Directory :directory="subdirectory" />
      </li>
    </ul>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeMount, onMounted } from "vue";
import { contextMenuStore } from "@/store/context-menu-store";
import Directory from "./Directory.vue";

defineProps({
  directory: {
    type: Object,
  },
});

const visible = ref(false);

onMounted(async () => {
  visible.value = await contextMenuStore.toggleOff();
});

const emit = defineEmits(["select"]);

/* onBeforeMount(async () => {
  await contextMenuStore.toggleOff();
}); */

const contextMenuDOM = ref(null);
//const contextMenu = ref(null);

const showContextMenu = ref(false);

const openContextMenu = async (e: any) => {
  console.log("rechtsklick", e);
  const position = await contextMenuStore.getPosition(e);

  console.log("pos", position);
  //contextMenu.value.toggleOn();
  //showContextMenu.value = contextMenuStore.toggleOn();
  //contextMenuStore.toggleOn();
  //getCurrentInstance()?.refs.contextMenu.toggleOn();
  await contextMenuStore.toggleOff();
  await contextMenuDOM.value.toggleOn();
  //setTimeout(tt.value.toggleOn(), 10000);
};

defineExpose({
  contextMenuDOM,
});
</script>
