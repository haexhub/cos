<template>
  <ul v-show="appStore.getState().isSelectionMenuVisible" class="
    -mt-25
    md:-mt-35
    -ml-15
    absolute 
    w-32
  ">
    <li @click="$emit('createKey')" class="
    mb-1
  ">
      <button class="
      py-1
      px-2
      md:py-2
      md:px-3
      rounded 
      hover:bg-primary
    ">

        <span class="text-md">
          Schlüssel
        </span>

        <Icon name="IconKey" class="w-6 pl-2" />
      </button>
    </li>

    <li @click="$emit('createDirectory')">
      <button class="
      py-1
      px-2
      md:py-2
      md:px-3
      rounded 
      hover:bg-primary 
    ">

        <span class="text-md">
          Ordner
        </span>

        <Icon name="IconFolder" class="w-6 pl-2" />
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { reactive, ref } from "@vue/reactivity"
import { onBeforeMount, onBeforeUpdate } from "@vue/runtime-core"
import { useRoute } from "vue-router"
import { IVaultDirectory, IVaultKey, vaultStore } from "../../../store/vault-store"
import { appStore } from "../../../store/app-store"



const isKey = ref(false)
const isDirectory = ref(false)
const isOverlayVisible = ref(false)

const route = useRoute()

const hashParams = reactive({
  vaultId: "",
  directoryId: ""
})

const showCreateKey = () => {
  console.log("lala")
  appStore.showOverlay()
  /* isOverlayVisible.value = true;
  isKey.value = true;
  isDirectory.value = false; */
};

const showCreateDirectory = () => {
  console.log("showCreateDirectory")
  /* isOverlayVisible.value = true;
  isKey.value = false;
  isDirectory.value = true; */
};

const createNewDirectory = async (directory: IVaultDirectory) => {
  try {
    const success = await vaultStore.addDirectory(
      directory,
      hashParams.directoryId
    );
    if (success) await vaultStore.saveVault(hashParams.vaultId);
  } catch (error) { }
}

const createNewKey = async (newKey: IVaultKey) => {
  try {
    const success = await vaultStore.addKey(
      newKey,
      hashParams.directoryId
    );
    if (success) await vaultStore.saveVault(hashParams.vaultId);
  } catch (error) { }
}

onBeforeMount(() => {
  Object.assign(hashParams, vaultStore.extractHashParams(route.hash))
})

onBeforeUpdate(() => {
  Object.assign(hashParams, vaultStore.extractHashParams(route.hash))
})
</script>