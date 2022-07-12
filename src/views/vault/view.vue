<template>
  <div @click="contextMenuStore.toggleOff">
    Vaultview
    {{ vaultFileJSON }}
    <input
      ref="vaultFile"
      type="file"
      @change="readInputFile()"
    />
    {{ vaultStore.state.rootDirectories}}
    <c-vault-store :rootDirectories="vaultStore.state.rootDirectories" />
  </div>
</template>

<script setup lang="ts">
import { contextMenuStore } from "@/store/context-menu-store";
import { onBeforeMount, onMounted, ref, computed, onBeforeUnmount } from "vue";
import { vaultStore } from "@/store/vault-store";
//import { vaultStore } from "@/store/vault-store";
onMounted(async () => {
  contextMenuStore.toggleOff();
});

const vaultFile = ref(null);
const vaultFileJSON = ref({});

const readInputFile = async (event: any) => {
  if (vaultFile.value) {
    console.log("readInpitFile", event);
    vaultFileJSON.value = JSON.parse(
      await vaultStore.readFile(vaultFile.value.files[0])
    );
  }
};
const vaultDB = {
  rootDirectories: ["245"],

  directories: {
    "1234": {
      name: "Internet",
      id: "1234",
      keys: ["452"],
      subDirectories: [],
    },

    "12345": {
      name: "Browser",
      id: "12345",
      keys: ["4522", "2345"],
      subDirectories: ["1234"],
    },

    "245": {
      name: "tolle Gruppe",
      id: "245",
      keys: ["5432", "753"],
      subDirectories: ["12345"],
    },
  },

  keys: {
    "2345": {
      id: "2345",
      title: "Key15",
      username: "olaf",
      urls: ["ok.de", "gmx.de"],
    },

    "4522": {
      id: "4522",
      title: "Key13",
      username: "olaf",
      urls: ["ok.de", "gmx.de"],
    },

    "753": {
      id: "753",
      title: "Key12",
      username: "bernd",
      urls: ["ok.de", "gmx.de"],
    },

    "452": {
      id: "452",
      title: "Key1",
      username: "pop",
      urls: ["ok.de", "gmx.de"],
    },

    "4523": {
      id: "4523",
      title: "Key2",
      username: "alfred",
      urls: ["alfredo.de"],
    },

    "5432": {
      id: "5432",
      title: "Key3",
      username: "ulf",
      urls: ["ok.de", "gmx.de"],
    },
  },
};

onBeforeMount(async () => {
  try {
    await vaultStore.init();
    if (vaultStore.state.rootDirectories.length == 0)
      await vaultStore.setVault(vaultDB);
  } catch (error) {
    console.log("ERROR VaultView ", error);
  }
});
</script>