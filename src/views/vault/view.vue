<template>
  <app-layout>
    <div class="h-screen" @click.exact="unmarkAllItems" @keyup.delete.exact="deleteMarkedItems"
      @keypress.alt.exact="markAllItems">

      <vault-logo />

      <div v-if="!hashParams.vaultId">
        <ul>
          <li v-for="vault in vaultStore.getState().vaults" :key="vault.id" class="mx-2">
            <button class="
              bg-primary 
              p-2 
              rounded 
              my-1 
              w-full
            " @click="openVault(vault.id || '')">
              {{ vault.fileName }}
            </button>
          </li>
        </ul>
      </div>

      <div v-else-if="hashParams.directoryId">
        <ul class="p-2">
          <li v-for="subdirectoryId in vaultStore
          .getState()
          .vaults
          ?.[hashParams.vaultId]
          ?.directories
          ?.[hashParams.directoryId]
          ?.subdirectories" :key="subdirectoryId" class="">
            <vault-item :vaultId="hashParams.vaultId" :directoryId="subdirectoryId" :ref="item" />
          </li>


          <li v-for="keyId in vaultStore
          .getState()
          .vaults
          ?.[hashParams.vaultId]
          ?.directories
          ?.[hashParams.directoryId]
          ?.keys" :key="keyId" class="">
            <vault-item :vaultId="hashParams.vaultId" :keyId="keyId" :ref="item" @editKey="showKeyDetails" />
          </li>

        </ul>
      </div>

      <div v-else>
        <ul class="p-2">
          <li v-for="subdirectoryId in vaultStore
          .getState()
          .vaults
          ?.[hashParams.vaultId]
          ?.directories
          ?.rootDirectory
          .subdirectories" :key="subdirectoryId">
            <vault-item :vaultId="hashParams.vaultId" :directoryId="subdirectoryId" :ref="item" />

          </li>

          <li v-for="keyId in vaultStore
          .getState()
          .vaults
          ?.[hashParams.vaultId]
          ?.directories
          ?.rootDirectory
          .keys" :key="keyId">
            <vault-item :vaultId="hashParams.vaultId" :keyId="keyId" :ref="item" @editKey="showKeyDetails" />
          </li>

          <li>
            <vault-item :vaultId="hashParams.vaultId" directoryId="trash" :ref="item" />
          </li>
        </ul>
      </div>

    </div>

    <template #menuBar>
      <vault-menu-bar-vault-items @createKey="createKey" @createDirectory="createDirectory" />
    </template>

    <template #overlay>
      <vault-key-details v-show="isKey" v-model="editMode" :keyId="key.id" @submit="saveKey" :onlyCreate="onlyCreate" />

      <vault-directory-details v-show="isDirectory" :parentDirectoryId="hashParams.directoryId"
        @submit="saveDirectory" />
    </template>
  </app-layout>
</template>

<script setup lang="ts">
import {
  onMounted,
  reactive,
  onBeforeUpdate,
  ref,
} from "vue";
import {
  IVaultFile,
  vaultStore,
  IKeyVaule,
  IVaultDirectory,
  IVaultKey
} from "../../store/vault-store";
import { useRoute, useRouter } from "vue-router";
import { appStore } from "../../store/app-store";

const route = useRoute();
const router = useRouter();
const isKey = ref(false)
const isDirectory = ref(false)
const onlyCreate = ref(false)
const editMode = ref(false)
const key = ref({} as IVaultKey)
const directory = ref({} as IVaultDirectory)

const hashParams = reactive({
  vaultId: "",
  directoryId: ""
})

let items = [] as IKeyVaule[]
const item = (el: IKeyVaule) => {
  if (el && !items.some(item => item?.[el.id]))
    items.push({ [el.id]: el })
};

const getVaultParams = () => {
  try {
    Object.assign(hashParams, vaultStore.extractHashParams(route.hash))

    vaultStore.setCurrentVault(hashParams.vaultId)
  } catch (error) {
    console.log("ERROR getVaultParams ", error);
  }
};

const openVault = (vaultId: string) => {
  try {
    router.push({
      path: "/vault/view",
      hash: `#vaultId=${vaultId}`,
    });
  } catch (error) { }
};

const markAllItems = () => {
  try {
    //console.log("markAllItems")
    items.forEach((item) => {
      const key = Object.keys(item)[0]
      item[key].mark();
    });
  } catch (error) {
    console.log("ERROR unmarkAllItems", error)
  }
}

const unmarkAllItems = () => {
  try {
    items.forEach((item) => {
      const key = Object.keys(item)[0]
      item[key].unmark();
      vaultStore.clearMarkedItems()
    });
  } catch (error) {
    console.log("ERROR unmarkAllItems", error)
  }
};

const deleteMarkedItems = () => {
  //console.log("delete")
  vaultStore.deleteMarkedItems()
  unmarkAllItems()
}

const createDirectory = () => {
  directory.value = {}
  isKey.value = false
  isDirectory.value = true
  onlyCreate.value = true
  editMode.value = true
  appStore.showOverlay()
};

const saveDirectory = async (directory: IVaultDirectory) => {
  try {
    const success = await vaultStore.addDirectory(
      directory,
      hashParams.directoryId
    );
    if (success) await vaultStore.saveVault(hashParams.vaultId);
  } catch (error) { }
}

const createKey = () => {
  key.value = {}
  isKey.value = true
  isDirectory.value = false
  onlyCreate.value = true
  editMode.value = true
  appStore.showOverlay()
}

const saveKey = async (newKey: IVaultKey) => {
  try {
    const success = await vaultStore.addKey(
      newKey,
      hashParams.directoryId
    );
    if (success) await vaultStore.saveVault(hashParams.vaultId);
  } catch (error) { }
}

const showDirectoryDetails = (_directory: IVaultDirectory) => {
  directory.value = _directory
  isKey.value = false
  isDirectory.value = true
  onlyCreate.value = false
  editMode.value = false
  appStore.showOverlay()
}

const showKeyDetails = (_key: IVaultKey) => {
  console.log("showKeyDetails", _key)
  key.value = _key
  isKey.value = true
  isDirectory.value = false
  onlyCreate.value = false
  editMode.value = false
  appStore.showOverlay()
}

onMounted(() => {
  getVaultParams();

  if (Object.keys(vaultStore.getState()?.vaults as IVaultFile).length < 1)
    router.push({ path: "/" });
  if (hashParams.vaultId)
    appStore.showMenuBar()
  else
    appStore.hideMenuBar()
});

onBeforeUpdate(() => {
  try {
    items = []
    getVaultParams();

    if (Object.keys(vaultStore.getState().vaults as IVaultFile).length < 1)
      router.push({ path: "/" });

    if (hashParams.vaultId)
      appStore.showMenuBar()
    else
      appStore.hideMenuBar()
  } catch (error) {
    console.log("ERROR VaultView onBeforeUpdate", error);
  }
});
</script>