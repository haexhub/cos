<template>
  <div class="p-1">

    <div v-if="!vaultId">
      <ul>
        <li
          v-for="vault in vaultStore.getState().vaults"
          :key="vault.id"
          class="mx-2"
        >
          <button
            class="
              bg-primary 
              p-2 
              rounded 
              my-1 
              w-full
            "
            @click="openVault(vault.id || '')"
          >
            {{ vault.fileName }}
          </button>
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
          v-for="subdirectoryId in vaultStore.getState().vaults?.[vaultId]?.directories?.rootDirectory.subdirectories"
          :key="subdirectoryId"
        >
          <vault-directory
            :vaultId="vaultId"
            :directoryId="subdirectoryId"
          />

        </li>

        <li
          v-for="keyId in vaultStore.getState().vaults?.[vaultId]?.directories?.rootDirectory.keys"
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
    <div class="absolute right-20 bottom-20">
      <div class="relative">
        <ul
          v-show="actionSubMenuVisible"
          class="-mt-25 -ml-10 absolute w-32"
        >
          <li
            class="transition-all duration-500 flex mb-1"
            :class="opacity"
          >
            <button class="
                p-2 
                rounded 
                hover:bg-primary
                duration-500
              ">
              <span class="text-md">Schlüssel</span>
              <Icon
                name="IconKey"
                class="w-6 pl-2"
              />
            </button>
          </li>

          <li
            class="transition-all duration-500"
            :class="opacity"
          >
            <button class="
              p-2 
              rounded 
              hover:bg-primary 
              duration-500
            ">
              <span class="text-md">Ordner</span>
              <Icon
                name="IconFolder"
                class="w-6 pl-2"
              />
            </button>
          </li>

        </ul>

        <Icon
          class="
          w-12
          p-2 
          bg-primary 
          rounded-full 
          hover:ring-4  
          duration-300 
          cursor-pointer 
          ring
          focus:rotate-45 
          transform
        "
          name="IconPlus"
          @focus="showActionSubMenu"
          @blur="hideActionSubMenu"
        />

      </div>
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
const actionSubMenuVisible = ref(false);
const opacity = ref("opacity-0");
const margin = ref("-mt-10");

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
    router.push({
      path: "/vault/view",
      hash: `#vaultId=${vaultId}`,
    });
  } catch (error) {}
};

const showActionSubMenu = () => {
  actionSubMenuVisible.value = true;
  setTimeout(() => {
    opacity.value = "opacity-100";
    margin.value = "-mt-20";
  }, 10);
};

const hideActionSubMenu = () => {
  opacity.value = "opacity-0";
  margin.value = "-mt-10";
  setTimeout(() => {
    actionSubMenuVisible.value = false;
  }, 500);
};

onBeforeMount(() => {
  getVaultParams();
  if (Object.keys(vaultStore.getState().vaults as {}).length < 1)
    router.push({ path: "/" });
});

onBeforeUpdate(() => {
  try {
    getVaultParams();

    if (Object.keys(vaultStore.getState().vaults as {}).length < 1)
      router.push({ path: "/" });
  } catch (error) {
    console.log("ERROR VaultView ", error);
  }
});
</script>