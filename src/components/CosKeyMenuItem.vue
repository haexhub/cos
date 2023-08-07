<template>
  <li
    class="flex flex-col cursor-pointer bg-primary-400 rounded border border-transparent hover:border-primary-600 border-4 py-1 px-2"
    @click.left="onMenuItemClick"
    @click.right.prevent="selected = !selected"
    :class="{ 'bg-red-400': selected }"
  >
    <div v-if="cosDirectory.id" class="flex space-x-1 items-center">
      <i :class="cosDirectory?.icon"></i>

      <div class="flex-grow">{{ cosDirectory?.name }}</div>
    </div>

    <div v-if="cosKey.id" class="flex space-x-1 items-center">
      <i :class="cosKey?.icon"></i>

      <div>{{ cosKey?.title }}</div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { PrimeIcons } from "primevue/api";
import { ref, PropType, computed, defineAsyncComponent } from "vue";
import router from "../router";
import { useRoute } from "vue-router";
import {
  updateDirectory,
  IPrimeNodeItem,
  addChildDirectory,
  createDirectory,
  cosKey as _cosKey,
  toogleExpandedDirectory,
  getDirectoryById,
  getKeyById,
  ICosDirectory,
  ICosKey,
  isDirectory,
  isKey,
  isExpandedDirectory,
} from "../stores/gun/useKey";

const props = defineProps({
  cosDirectory: {
    type: Object as PropType<ICosDirectory>,
    default: {},
  },

  cosKey: {
    type: Object as PropType<ICosKey>,
    default: {},
  },

  parentId: {
    type: String,
    default: "",
  },
});

const menu = ref();
const route = useRoute();
const selected = ref(false);
const directoryPanel = ref();
const directoryName = ref("");

const openDirectoryPanel = (event: Event) => {
  //console.log("openDirectoryPanel", event);
  directoryPanel.value.show(event);
};

const contextMenu = ref();
const contextMenuItems = [
  {
    label: "Ordner hinzufügen",
    icon: "IconFolderPlus",
    onClick: "createDirectory",
  },
  {
    label: "Ordner löschen",
    icon: "IconFolderMinus",
    onClick: "removeDirectory",
  },
  {
    label: "Schlüssel hinzufügen",
    icon: "IconKeyPlus",
    onClick: "createKey",
  },
  {
    label: "Schlüssel löschen",
    icon: "IconKeyMinus",
    onClick: "removeKey",
  },
];

const itemsDirectory = [
  {
    label: "Ordner hinzufügen",
    icon: "IconFolderPlus",
    onClick: "createDirectory",
  },
  {
    label: "Ordner löschen",
    icon: "IconFolderMinus",
    onClick: "removeDirectory",
  },
  {
    label: "Schlüssel hinzufügen",
    icon: "IconKeyPlus",
    onClick: "createKey",
  },
  {
    label: "Schlüssel löschen",
    icon: "IconKeyMinus",
    onClick: "removeKey",
  },
];

const onMenuItemClick = () => {
  const currentHash = route.hash.length > 0 ? route.hash : "#";

  console.log("currentHash", currentHash);
  router.push({ hash: `${currentHash}/${props.cosDirectory.id}` });
  //toogleExpandedNode(props.cosDirectory.id);
};

const onContextMenuClick = (event: Event) => {
  contextMenu.value.show(event);
};

const emit = defineEmits([
  "removeDirectory",
  "createDirectory",
  "createKey",
  "removeKey",
]);
</script>
