<template>
  <div class="p-1 h-screen" @click.exact="unmarkItems" @keyup.delete="deleteMarkedItems">
    <!-- {{ vaultStore.getState().vaults }} -->
    <div v-if="!vaultId">
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

    <div v-else-if="directoryId">
      <ul class="pl-2">
        <li v-for="subdirectoryId in directory.subdirectories" :key="subdirectoryId" class="m-1">
          <vault-item :vaultId="vaultId" :directoryId="subdirectoryId" :ref="item" />
        </li>

        <li v-for="keyId in directory.keys" :key="keyId" class="m-1">
          <vault-item :vaultId="vaultId" :keyId="keyId" :ref="item" />
        </li>
      </ul>
    </div>

    <div v-else>
      <ul class="">
        <li v-for="subdirectoryId in vaultStore
        .getState()
        .vaults
        ?.[vaultId]
        ?.directories
        ?.rootDirectory
        .subdirectories" :key="subdirectoryId">
          {{ subdirectoryId }}
          <vault-item :vaultId="vaultId" :directoryId="subdirectoryId" :ref="item" />

        </li>

        <li v-for="keyId in vaultStore
        .getState()
        .vaults
        ?.[vaultId]
        ?.directories
        ?.rootDirectory
        .keys" :key="keyId">
          <vault-item :vaultId="vaultId" :keyId="keyId" :ref="item" />
        </li>

        <li>
          <vault-item :vaultId="vaultId" directoryId="trash" :ref="item" />
        </li>
      </ul>
    </div>

    <vault-menu-bar></vault-menu-bar>
    <!-- Action Menu -->
    <div class="
      absolute 
      right-20 
      bottom-20
    ">
      <div class="">
        <ul v-show="actionSubMenuVisible" class="-mt-25 -ml-10 absolute w-32">
          <li class="transition-all duration-500 flex mb-1" :class="opacity">
            <button class="
                p-2 
                rounded 
                hover:bg-primary
                duration-500
              " @click="createNewKey">
              <span class="text-md">Schlüssel</span>
              <Icon name="IconKey" class="w-6 pl-2" />
            </button>
          </li>

          <li class="transition-all duration-500" :class="opacity">
            <button class="
              p-2 
              rounded 
              hover:bg-primary 
              duration-500
            " @click="createNewDirectory">
              <span class="text-md">Ordner</span>
              <Icon name="IconFolder" class="w-6 pl-2" />
            </button>
          </li>

        </ul>

        <Icon class="
          w-12
          p-2 
          bg-primary
          hover:bg-primary-hover
          focus:bg-primary-focus
          rounded-full 
          hover:ring-4  
          duration-300 
          cursor-pointer 
          ring
          transform
        " :class="rotate" name="IconPlus" @blur="hideActionSubMenu" @click.capture="toggleActionSubMenu" />

      </div>
    </div>

  </div>

  <vault-overlay v-model="overlayVisible">
    <vault-key-details v-if="createKey" v-model="overlayVisible" @submit="addKey" editMode />

    <vault-directory-details v-if="createDirectory" v-model="overlayVisible" :parentDirectoryId="directoryId"
      @submit="addDirectory" />
  </vault-overlay>
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
import {
  IVaultFile,
  IVaultDirectory,
  vaultStore,
  IVaultKey,
  IVaultDirectoryDB,
  IKeyVaule
} from "../../store/vault-store";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const vaultId = ref("");
const directory = ref({} as IVaultDirectory);
const directoryId = ref("");
const rootDirectory = ref({});
const actionSubMenuVisible = ref(false);
const opacity = ref("opacity-0");
const margin = ref("-mt-10");
const rotate = ref("rotate-0");
const overlayVisible = ref(false);
const createDirectory = ref(false);
const createKey = ref(false);
let items = [] as IKeyVaule[]
const item = (el: IKeyVaule) => {
  if (el && !items.some(item => item?.[el.id]))
    items.push({ [el.id]: el })
};

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

    vaultStore.setCurrentVault(vaultId.value)

    rootDirectory.value =
      vaultStore.getDirectory("rootDirectory", vaultId.value) || {};

    directory.value = vaultStore.getDirectory(directoryId.value, vaultId.value) || {}
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

const showActionSubMenu = () => {
  actionSubMenuVisible.value = true;
  setTimeout(() => {
    opacity.value = "opacity-100";
    margin.value = "-mt-20";
    rotate.value = "rotate-135";
  }, 10);
};

const hideActionSubMenu = () => {
  opacity.value = "opacity-0";
  margin.value = "-mt-10";
  rotate.value = "rotate-0";
  setTimeout(() => {
    actionSubMenuVisible.value = false;
  }, 500);
};

const toggleActionSubMenu = () => {
  if (actionSubMenuVisible.value) {
    hideActionSubMenu();
  } else showActionSubMenu();
};

const createNewKey = () => {
  overlayVisible.value = true;
  createKey.value = true;
  createDirectory.value = false;
};

const createNewDirectory = () => {
  overlayVisible.value = true;
  createKey.value = false;
  createDirectory.value = true;
};

const addDirectory = async (newDirectory: IVaultDirectory) => {
  try {
  } catch (error) { }
};

const addKey = async (newKey: IVaultKey) => {
  console.log("speicher neuen key", newKey);
  try {
    const success = await vaultStore.addKey(
      newKey,
      directoryId.value
    );
    if (success) await vaultStore.saveVault(vaultId.value);
  } catch (error) { }
};

const unmarkItems = () => {
  items.forEach((item) => {
    const key = Object.keys(item)[0]
    item[key].unmark();
    vaultStore.clearMarkedItems()
  });
};

const deleteMarkedItems = () => {
  vaultStore.deleteMarkedItems()
  unmarkItems()
}

onMounted(() => {
  getVaultParams(); /*
  if (Object.keys(vaultStore.getState()?.vaults as IVaultFile).length < 1)
    router.push({ path: "/" }); */
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