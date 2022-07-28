<template>
  <div class="h-screen" @click.exact="unmarkAllItems" @keyup.delete.exact="deleteMarkedItems"
    @keypress.alt.exact="markAllItems">

    <vault-logo />

    <!-- {{ vaultStore.getState().vaults }} -->
    <!--    <div class="flex flex-col p-4">
      <Icon name="IconDungeon" class="w-24 stroke-light-100 mx-auto" />
      <div> {{ vaultStore.getState().vaults?.[hashParams.vaultId]?.fileName }}</div>
    </div> -->

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

    <div v-if="hashParams.directoryId">
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
          <vault-item :vaultId="hashParams.vaultId" :keyId="keyId" :ref="item" />
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
          <vault-item :vaultId="hashParams.vaultId" :keyId="keyId" :ref="item" />
        </li>

        <li>
          <vault-item :vaultId="hashParams.vaultId" directoryId="trash" :ref="item" />
        </li>
      </ul>
    </div>

    <vault-menu-bar></vault-menu-bar>
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  reactive,
  onBeforeUpdate,
} from "vue";
import {
  IVaultFile,
  vaultStore,
  IKeyVaule
} from "../../store/vault-store";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

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
    console.log("markAllItems")
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
  console.log("delete")
  vaultStore.deleteMarkedItems()
  unmarkAllItems()
}

onMounted(() => {
  getVaultParams();

  if (Object.keys(vaultStore.getState()?.vaults as IVaultFile).length < 1)
    router.push({ path: "/" });
});

onBeforeUpdate(() => {
  try {
    items = []
    getVaultParams();

    if (Object.keys(vaultStore.getState().vaults as IVaultFile).length < 1)
      router.push({ path: "/" });
  } catch (error) {
    console.log("ERROR VaultView onBeforeUpdate", error);
  }
});
</script>