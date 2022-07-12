<template>
  <div class="flex flex-col h-screen">

    <div class="bg-blue-500 p-t-b-10 shadow-blue-300 shadow-md">
      <h1 class="text-slate-300 text-6xl text-center expanse font-bold">Chamber of Secrets</h1>
    </div>

    <div class="bg-blue-200 flex-1">
      <ul>
        <li>
          <button class="shadow-md w-full ">DemoDatenbank</button>
        </li>
      </ul>
      {{ vaultStore.state.vaults}}
    </div>

    <div class="bg-blue-500">
      <ul class="">
        <li class="">
          <button
            class="w-full shadow p-2"
            @click="createNewDatabase"
          >
            neue Datenbank anlegen
            <span v-html="MdiDatabasePlus" />
          </button>
        </li>

        <li>
          <button
            class="
              w-full
              shadow
              p-2"
            @click="openVaultDatabase"
          >
            vorhandene Datenbank öffnen
            <span v-html="MdiFolderKey" />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import MdiFolderKey from "~icons/mdi/folder-key-outline?raw&width=1em&height=1em";
import MdiDatabasePlus from "~icons/mdi/database-plus-outline?raw&width=1em&height=1em";
import { vaultStore } from "@/store/vault-store";

//const vaults = reactive(vaultStore.state.vaults);
const createNewDatabase = async () => {
  await vaultStore.createNewDatabase();
};

const openVaultDatabase = async () => {
  await vaultStore.open();
};
</script>
