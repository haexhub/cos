<template>
  <app-layout>
    <div class="flex flex-col h-screen">

      <vault-logo />

      <div class="">
        <ul class="flex flex-col">
          <li class="shadow mb-1">
            <basic-button class="
              w-full 
              text-md 
              bg-secondary
              hover:bg-secondary-hover
              focus:bg-secondary-focus 
            " @click="createNewDatabase">
              <span>neue Datenbank anlegen</span>
              <Icon name="IconDatabasePlus" class="w-4 h-4 inline-block ml-3" iconClass="stroke-none" />
            </basic-button>
          </li>

          <li class="shadow mb-1">
            <basic-button class="w-full text-md" @click="getFileHandle">
              <span>vorhandene Datenbank öffnen</span>
              <Icon name="IconDatabaseSearch" class="w-4 inline-block ml-3" iconClass="stroke-none" />
            </basic-button>
          </li>
        </ul>
      </div>

    </div>

    <template #overlay>
      <basic-input id="password" title="Passwort" type="password" v-model="password" @keydown.enter="handleEnter" />
      <div class="flex justify-between pt-2">
        <basic-button class="bg-warning focus:bg-warning-focus hover:bg-warning-hover" @click="appStore.hideOverlay()">
          Abbrechen
        </basic-button>

        <basic-button v-if="newDB" @click="saveNewVault">
          Speichern
        </basic-button>

        <basic-button v-else @click="openVault">
          Öffnen
        </basic-button>
      </div>
    </template>
  </app-layout>
</template>


<script setup lang="ts">
import { useRouter } from "vue-router";
import { IVaultFile, vaultStore } from "../../store/vault-store";
import { ref, watch, onUpdated, onBeforeUpdate, onBeforeMount } from "vue";
import { appStore } from "../../store/app-store";

const router = useRouter();

const password = ref("");
//@ts-ignore
let fileHandle = {} as FileSystemFileHandle;
const newDB = ref(false);

const createNewDatabase = async () => {
  newDB.value = true;

  const newFileHandle = await vaultStore.createNewFileHandle();

  if (newFileHandle) {
    fileHandle = newFileHandle;
    showPasswordPrompt();
  }
};

const saveNewVault = async () => {
  const newVault = vaultStore.templateNewDatabase;

  newVault.password = password.value;
  newVault.fileHandle = fileHandle;

  if (newVault.id) {
    vaultStore.addVaultFile(newVault, fileHandle);
    const success = await vaultStore.saveVault(newVault.id);
  }

  console.log("create new vault", newVault);

  appStore.hideOverlay()

  if (newVault.id) {
    console.log("push router");
    router.push({
      path: "/vault/view",
      hash: `#vaultId=${newVault.id}`,
    });
  }
};

const openVault = async () => {
  try {
    const vault = await vaultStore.decryptVaultFileHandle(
      fileHandle,
      password.value
    );

    if (!vault) return;

    appStore.hideOverlay()

    vaultStore.addVaultFile(vault, fileHandle);

    if (vault.id) {
      router.push({
        path: "/vault/view",
        hash: `#vaultId=${vault.id}`,
      });
    }
  } catch (error) { }
};

const getFileHandle = async () => {
  newDB.value = false;
  const vaultFileHandle = await vaultStore.getVaultFileHandle();

  if (vaultFileHandle) {
    fileHandle = vaultFileHandle;
    showPasswordPrompt();
  }
};

const showPasswordPrompt = () => {
  appStore.showOverlay()

  setTimeout(() => {
    document
      .getElementById("password")
      ?.getElementsByTagName("input")[0]
      ?.focus();
  }, 50);
};

const handleEnter = () => {
  if (newDB.value) {
    saveNewVault();
  } else {
    openVault();
  }
};

const handleEsc = () => {
  appStore.hideOverlay()
};

onBeforeMount(() => appStore.hideMenuBar())
onBeforeUpdate(() => appStore.hideMenuBar())

</script>
