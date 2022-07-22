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
    </div>

    <div class="bg-blue-500">
      <ul class="flex flex-col items-stretch">
        <li class="shadow">
          <button
            class="w-full p-2"
            @click="createNewDatabase"
          >
            neue Datenbank anlegen
            <Icon
              name="IconDatabasePlus"
              class="w-4 h-4 inline-block"
              iconClass="stroke-none"
            />
          </button>
        </li>

        <li class="shadow">
          <button
            class="
              w-full
              p-2"
            @click="getFileHandle"
          >
            vorhandene Datenbank öffnen
            <Icon
              name="IconDatabaseSearch"
              class="w-4 h-4 inline-block"
              iconClass="stroke-none"
            />
          </button>
        </li>
      </ul>
    </div>

    <div ref="overlayWrapper">
      <vault-overlay v-model="promptPassword">
        <basic-input
          title="Passwort"
          type="password"
          v-model="password"
        />

        <div class="flex justify-between pt-2">
          <basic-button
            class="bg-warning focus:bg-warning-focus hover:bg-warning-hover"
            @click="promptPassword = false"
          >
            Abbrechen
          </basic-button>

          <basic-button
            v-if="!newDB"
            @click="open"
          >
            Öffnen
          </basic-button>

          <basic-button
            v-if="newDB"
            @click="save"
          >
            Speichern
          </basic-button>

        </div>
      </vault-overlay>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { IVaultFile, vaultStore } from "../../store/vault-store";
import { ref, watch, onUpdated } from "vue";

const router = useRouter();

const promptPassword = ref(false);
const password = ref("");
//@ts-ignore
let fileHandle = {} as FileSystemFileHandle;
const newDB = ref(false);

const createNewDatabase = async () => {
  newDB.value = true;

  const newFileHandle = await vaultStore.createNewFileHandle();

  if (newFileHandle) {
    fileHandle = newFileHandle;
    promptPassword.value = true;
  }
};

const save = async () => {
  const v = await vaultStore.saveFileEncrypted(
    fileHandle,
    JSON.stringify(vaultStore.templateNewDatabase),
    password.value
  );
};

const open = async () => {
  try {
    const vault = await vaultStore.decryptVaultFileHandle(
      fileHandle,
      password.value
    );
    promptPassword.value = false;

    if (!vault) return;

    vaultStore.addVaultFile(vault, fileHandle);

    if (vault.id) {
      router.push({
        path: "/vault/view",
        hash: `#vaultId=${vault.id}`,
      });
    }
  } catch (error) {}
};
const getFileHandle = async () => {
  newDB.value = false;
  fileHandle = await vaultStore.getVaultFileHandle();

  promptPassword.value = true;
};
</script>
