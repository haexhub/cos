<template>
  <div class="flex flex-col h-screen">

    <div class="p-6">
      <h1 class="
        flex 
        flex-col 
        text-slate-300 
        text-3xl 
        text-center 
        expanse 
        font-bold 
        expanse 
        pb-2
      ">
        <span>Chamber</span>
        <span class="text-xl">of</span>
        <span class="text-primary">Secrets</span>

      </h1>
    </div>

    <div class="">
      <ul class="flex flex-col">
        <li class="shadow mb-1">
          <basic-button
            class="
              w-full 
              text-md 
              bg-secondary
              hover:bg-secondary-hover 
            "
            @click="createNewDatabase"
          >
            <span>neue Datenbank anlegen</span>
            <Icon
              name="IconDatabasePlus"
              class="w-4 h-4 inline-block ml-3"
              iconClass="stroke-none"
            />
          </basic-button>
        </li>

        <li class="shadow mb-1">
          <basic-button
            class="w-full text-md"
            @click="getFileHandle"
          >
            <span>vorhandene Datenbank öffnen</span>
            <Icon
              name="IconDatabaseSearch"
              class="w-4 h-4 inline-block ml-3"
              iconClass="stroke-none"
            />
          </basic-button>
        </li>
      </ul>
    </div>

    <vault-overlay
      v-model="promptPassword"
      @keyup.enter.prevent="handleEnter"
      @keyup.esc.prevent="handleEsc"
    >

      <basic-input
        id="password"
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
          v-if="newDB"
          @click="save"
        >
          Speichern
        </basic-button>

        <basic-button
          v-else
          @click="open"
        >
          Öffnen
        </basic-button>
      </div>

    </vault-overlay>
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
    showPasswordPrompt();
  }
};

const save = async () => {
  const newVault = vaultStore.templateNewDatabase;

  vaultStore.addVaultFile(newVault, fileHandle);
  const success = await vaultStore.saveFileEncrypted(
    fileHandle,
    JSON.stringify(newVault),
    password.value
  );

  console.log("create new vault", newVault);
  promptPassword.value = false;

  if (newVault.id) {
    router.push({
      path: "/vault/view",
      hash: `#vaultId=${newVault.id}`,
    });

    setTimeout(() => {
      console.log("router puuuusshh");
    }, 1000);
  }
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
  const vaultFileHandle = await vaultStore.getVaultFileHandle();

  if (vaultFileHandle) {
    fileHandle = vaultFileHandle;
    showPasswordPrompt();
  }
};

const showPasswordPrompt = () => {
  promptPassword.value = true;
  const passwordInput = document.getElementById("password")
    ?.lastChild as HTMLElement;

  setTimeout(() => {
    passwordInput?.focus();
  }, 500);
};

const handleEnter = () => {
  if (newDB.value) {
    save();
  } else {
    open();
  }
};

const handleEsc = () => {
  promptPassword.value = false;
};
</script>
