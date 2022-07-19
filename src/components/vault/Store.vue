<template>
  <main class="bg-gray-500  flex">
    <aside class="bg-red-200 p-1">

      <nav>
        <ul
          v-for="directoryId in rootDirectories"
          :key="directoryId + ''"
          class="flex flex-col"
        >
          <li class="bg-red-300 ">
            <vault-directory :value="directoryId"></vault-directory>

          </li>
        </ul>
      </nav>
    </aside>

    <section v-if="currentDirectory && currentDirectory.keys">
      <VTable :data="currentDirectory.keys">
        <template #head>
          <VTh sortKey="title">Title</VTh>
          <VTh sortKey="username">username</VTh>
          <VTh sortKey="url">Url</VTh>
        </template>
        <template #body="{rows}">
          <tr
            v-for="row in rows"
            :key="row.id"
            class="hover:bg-blue-300"
          >
            <td>{{ row.title }}</td>
            <td>{{ row.username }}</td>
            <td>{{ row.urls[0] }}</td>
          </tr>
        </template>
      </VTable>
    </section>

  </main>
</template>


<script setup lang="ts">
import { onBeforeMount, ref, reactive, onMounted } from "vue";
import { vaultStore } from "@/store/vault-store.ts";
import { contextMenuStore } from "@/store/context-menu-store.ts";
import { IVaultDirectory } from "../../store/vault-store";

defineProps({
  rootDirectories: {
    type: Array,
    default: (): IVaultDirectory[] => [],
  },
});

const emit = defineEmits(["select"]);

const contextMenuDOM = ref(null);
const currentDirectory = ref({} as IVaultDirectory);
const visible = ref(false);

onBeforeMount(async () => {
  console.log("beforemount Store");
  //await vaultStore.init();
});

onMounted(async () => {
  console.log("mount Store");
  visible.value = await contextMenuStore.toggleOff();
});

const setSelectedDirectory = (directory: any) => {
  console.log("select directoy");
  currentDirectory.value = directory;
};

/* const openContextMenu = async (e: any) => {
  console.log("rechtsklick", e);
  const position = await contextMenuStore.getPosition(e);
  await contextMenuStore.toggleOff();
  //await contextMenuDOM.value.toggleOn();
}; */
</script>