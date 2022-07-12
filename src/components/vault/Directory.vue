<template>
  <div class="p-l-r-1 bg-blue-200">
    <button
      @click="emit('select', directory.id)"
      @contextmenu.prevent="openContextMenu"
    >
      {{ directory.name }}

    </button>

    <context-menu
      ref="contextMenuDOM"
      :class="[contextMenuStore.state.show ? '' : 'hidden']"
    >
      <context-menu-directory @createDirectory="createDirectory" />
    </context-menu>

    <ul class="p-l-2">
      <li
        v-for="subdirectoryId in directory.subDirectories"
        :key="subdirectoryId"
      >
        <Directory :value="subdirectoryId" />
      </li>
    </ul>

  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  watch,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
} from "vue";
import { contextMenuStore } from "@/store/context-menu-store";
import Directory from "./Directory.vue";
import { vaultStore } from "@/store/vault-store";

const props = defineProps({
  value: {
    type: String,
  },
});

onBeforeUpdate(async () => {
  try {
    //directory.value = await vaultStore.getDirectory(props.value);
  } catch (error) {
    console.log("ERROR Directory ", error);
  }
});

onMounted(async () => {
  //console.log("directory got ", await vaultStore.getDirectory(props.value));
  directory.value = await vaultStore.getDirectory(props.value);
});

const directory = ref({});
const visible = ref(false);
const emit = defineEmits(["select"]);
const contextMenuDOM = ref(null);
const showContextMenu = ref(false);

const createDirectory = async () => {
  const dummyDirectory = {
    name: "neue Gruppe",
    id: "1325633s",
    keys: [],
    subdirectories: [],
  };
  await vaultStore.addDirectory(dummyDirectory, directory.value.id);
};
const openContextMenu = async (e: any) => {
  //console.log("rechtsklick", e);
  //const position = await contextMenuStore.getPosition(e);

  //console.log("pos", position);
  await contextMenuStore.toggleOff();
  await contextMenuDOM.value.toggleOn();
  /* await vaultStore.addDirectory("123", {
    name: "Hinzhugefügt",
    id: "1325",
    keys: [],
    subdirectories: [{ name: "Mail", id: "1234", keys: [] }],
  }); */
};

defineExpose({
  contextMenuDOM,
});
</script>
