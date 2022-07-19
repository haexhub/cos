<template>
  <main class="">
    <aside class="">
      <nav>
        <button>
          {{ vault.fileName }}
        </button>

        <ul
          v-for="directoryId in vault.rootDirectories"
          :key="directoryId + ''"
          class="flex flex-col items-stretch"
        >
          <li class="">
            <vault-directory
              :directoryId="directoryId"
              :vaultId="vaultId"
              @select="setSelectedDirectory"
            />

          </li>
        </ul>
      </nav>
    </aside>

  </main>
</template>


<script setup lang="ts">
import { onBeforeMount, ref, reactive, onMounted } from "vue";
import { vaultStore } from "@/store/vault-store.ts";
import { contextMenuStore } from "@/store/context-menu-store.ts";
import { IVaultDirectory, IVaultFile } from "../../store/vault-store";

const props = defineProps({
  vaultId: {
    type: String,
    required: true,
  },
});

const vault = reactive(vaultStore.getVault(props.vaultId));

const setSelectedDirectory = (directoryId: string) => {
  //console.log("select directoy ", props.value.id, directoryId);
  //vaultStore.setSelectedDirectory(directoryId);
  //currentDirectory.value.id = directoryId;
};

/* const openContextMenu = async (e: any) => {
  console.log("rechtsklick", e);
  const position = await contextMenuStore.getPosition(e);
  await contextMenuStore.toggleOff();
  //await contextMenuDOM.value.toggleOn();
}; */
</script>