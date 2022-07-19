<template>
  <div class="flex flex-col h-full">

    <div class="bg-blue-500 p-t-b-10 shadow-blue-300 shadow-md">
      <h1 class="text-slate-300 text-6xl text-center expanse font-bold">Chamber of Secrets</h1>
    </div>

    <div class="bg-blue-200 flex-1">
      <ul>
        <li>
          <button class="shadow-md w-full ">DemoDatenbank</button>
        </li>
      </ul>
      vaults {{ vaultStore.state.vaults}}
    </div>

    <div class="bg-blue-500">
      <ul class="flex flex-col items-stretch">
        <li class="shadow">
          <button
            class="w-full p-2"
            @click="createNewDatabase"
          >
            neue Datenbank anlegen
            <span
              class="inline-block pl-2"
              v-html="MdiDatabasePlus"
            />
          </button>
        </li>

        <li class="shadow">
          <button
            class="
              w-full
              p-2"
            @click="openVaultDatabase"
          >
            vorhandene Datenbank öffnen
            <span
              class="inline-block pl-2"
              v-html="MdiFolderKey"
            />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import MdiFolderKey from "~icons/mdi/folder-key-outline?raw&width=1em&height=1em";
import MdiDatabasePlus from "~icons/mdi/database-plus-outline?raw&width=1em&height=1em";
import { vaultStore } from "@/store/vault-store.ts";

const router = useRouter();

const createNewDatabase = async () => {
  const vaultId = await vaultStore.createNewDatabase();
  if (vaultId) {
    router.push({
      path: "/vault/view",
      hash: `#vaultId=${vaultId}`,
    });
  }
};

const openVaultDatabase = async function () {
  const vaultId = await vaultStore.openVaultDB();

  if (vaultId) {
    router.push({
      path: "/vault/view",
      hash: `#vaultId=${vaultId}`,
    });
  }
};
</script>
