<template>
  <main class="bg-gray-500 p-t-2 flex">
    <aside>
      <nav>
        <ul
          v-for="directory in vault"
          :key="directory.id"
          class="flex flex-col"
        >
          <li class="bg-red-300 p-1">
            <vault-directory
              :directory="directory"
              @select="setSelectedDirectory"
            />
          </li>
        </ul>
      </nav>
    </aside>

    <section v-if="currentDirectory.keys">
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
import { onBeforeMount, ref } from "vue";
import { vaultStore } from "@/store/vault-store";

defineProps({
  vault: {
    type: Array,
  },
});

onBeforeMount(async () => {
  await vaultStore.init();
});

const currentDirectory = ref({});

const setSelectedDirectory = (directory: any) => {
  console.log("select directoy");
  currentDirectory.value = directory;
};
</script>