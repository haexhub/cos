<template>
  <div class="">
    <dropdown-menu text="Menü" />

    <div v-if="!vaultId">
      <ul>
        <li
          v-for="vault in vaultStore.state.vaults"
          :key="vault.id"
          class="mx-2"
        >
          <button
            class="bg-primary p-2 rounded my-1 w-full"
            @click="openVault(vault.id)"
          >{{ vault.fileName }}</button>

        </li>
      </ul>
    </div>

    <div v-else-if="directoryId">
      zeige directory {{ directory}}

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

      <!-- rrr{{vaultStore.state.vaults}} -->
      <!-- <vault-directory
        v-for="directoryId in vaultStore.state.vaults?.[vaultId]?.directories.rootDirectory?.subdirectories"
        :key="directoryId"
        :directoryId="directoryId"
        :vaultId="vaultId"
      /> -->
      rootDirectory {{vaultStore.state.vaults}}
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

      <!-- <vault-directory
        directoryId="rootDirectory"
        :vaultId="vaultId"
      /> -->

      <!-- {{vaultStore.state.vaults[vaultId].keys}} -->
      <!-- <vault-key
        v-for="keyId in vaultStore.state.vaults[vaultId].keys"
        :key="keyId"
        :keyId="keyId"
        :vaultId="vaultId"
      /> -->
    </div>
    <!--  <vault-file
      
      :key="vault.id"
      :vaultId="vault.id"
    /> -->

    <!-- <section v-if="currentDirectory && currentDirectory.keys">
      <VTable :data="currentDirectory.keys">
        <template #head>
          <VTh sortKey="title">Title</VTh>
          <VTh sortKey="username">username</VTh>
          <VTh sortKey="url">Url</VTh>
        </template>
        <template #body="{rows}">
          <tr
            v-for="row in rows"
            :key="row.id"
            class="hover:bg-blue-300"
          >
            <td>{{ row.title }}</td>
            <td>{{ row.username }}</td>
            <td>{{ row.urls[0] }}</td>
          </tr>
        </template>
      </VTable>
    </section> -->

    <!--  <input
      ref="vaultFile"
      type="file"
      @change="readInputFile"
    /> -->
    <!-- <ul>
      <li
        v-for="vault in vaultStore.state.vaults"
        :key="vault.id"
      >{{ vault.fileName }}</li>
      <c-vault-store
        v-if="vaultStore.state.vaults.length"
        :rootDirectories="vaultStore.state.vaults[0].rootDirectories"
      />
    </ul> -->

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
import { vaultStore } from "@/store/vault-store.ts";
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

    //if (Object.keys(rootDirectory.value).length < 1 )
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
  console.log("beforeMount ", vaultStore.state.vaults);
  getVaultParams();
  if (Object.keys(vaultStore.state.vaults).length < 1)
    router.push({ path: "/" });
});

onMounted(() => {
  try {
    //getVaultParams();
    console.log("vaulview onMounted ", vaultStore.state.vaults);
  } catch (error) {
    console.log("ERROR ", error);
  }
});

onBeforeUpdate(() => {
  try {
    console.log("onBeforeUpdate ", vaultStore.state.vaults);
    getVaultParams();

    if (Object.keys(vaultStore.state.vaults).length < 1)
      router.push({ path: "/" });
  } catch (error) {
    console.log("ERROR VaultView ", error);
  }
});
</script>