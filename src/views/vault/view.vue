<template>
  <div class="">

    <div v-if="!vaultId">
      <ul>
        <li
          v-for="vault in vaultStore.state.vaults"
          :key="vault.id"
          class="mx-2"
        >
          <button
            class="bg-primary p-2 rounded my-1 w-full"
            @click="openVault(vault.id || '')"
          >{{ vault.fileName }}</button>

        </li>
      </ul>
    </div>

    <div v-else-if="directoryId">
      <ul class="pl-2">
        <li
          v-for="subdirectoryId in directory.subdirectories"
          :key="subdirectoryId"
        >
          <vault-directory
            :vaultId="vaultId"
            :directoryId="subdirectoryId"
          />
        </li>

        <li
          v-for="keyId in directory.keys"
          :key="keyId"
        >
          <vault-key
            :vaultId="vaultId"
            :keyId="keyId"
          />
        </li>
      </ul>
    </div>

    <div v-else>
      <ul class="">
        <li
          v-for="subdirectoryId in vaultStore.state.vaults?.[vaultId]?.directories?.rootDirectory.subdirectories"
          :key="subdirectoryId"
        >
          <vault-directory
            :vaultId="vaultId"
            :directoryId="subdirectoryId"
          />

        </li>

        <li
          v-for="keyId in vaultStore.state.vaults?.[vaultId]?.directories?.rootDirectory.keys"
          :key="keyId"
        >
          <vault-key
            :vaultId="vaultId"
            :keyId="keyId"
          />
        </li>
      </ul>
    </div>

    <!-- Action Menu -->
    <div class="absolute right-10 bottom-10">

      <Icon
        name="IconPlus"
        class="w-10 bg-primary rounded-full p-2 hover:(w-12 p-3 ring-4)  duration-300 cursor-pointer ring"
      />

    </div>
  </div>
</template>

<script setup lang="ts">
import {
  onBeforeMount,
  onMounted,
  ref,
  computed,
  onBeforeUnmount,
  reactive,
  onBeforeUpdate,
  onUnmounted,
} from "vue";
import { IVaultFile, vaultStore } from "../../store/vault-store";
import { useRoute, useRouter } from "vue-router";
import { IVaultDirectory } from "../../store/vault-store";

const route = useRoute();
const router = useRouter();

const vaultId = ref("");
const directory = ref({} as IVaultDirectory);
const directoryId = ref("");
const rootDirectory = ref({});

const getVaultParams = () => {
  try {
    vaultId.value = "";
    directoryId.value = "";
    rootDirectory.value = {};
    directory.value = {};

    const vaultParams = route.hash
      .replace(/^#/, "")
      .split("&")
      .map((param) => param.split("="));

    vaultParams.forEach((param) => {
      if (param[0] === "vaultId") vaultId.value = param[1];
      if (param[0] === "directoryId") directoryId.value = param[1];
    });

    rootDirectory.value =
      vaultStore.getDirectory(vaultId.value, "rootDirectory") || {};

    directory.value = vaultStore.getDirectory(vaultId.value, directoryId.value);
  } catch (error) {
    console.log("ERROR getVaultParams ", error);
  }
};

const openVault = (vaultId: string) => {
  try {
    router.push({ path: "/vault/view", hash: `#vaultId=${vaultId}` });
  } catch (error) {}
};

onBeforeMount(() => {
  getVaultParams();
  /* if (Object.keys(vaultStore.state.vaults as {}).length < 1)
    router.push({ path: "/" }); */
});

onBeforeUpdate(() => {
  try {
    getVaultParams();

    if (Object.keys(vaultStore.state.vaults as {}).length < 1)
      router.push({ path: "/" });
  } catch (error) {
    console.log("ERROR VaultView ", error);
  }
});
</script>