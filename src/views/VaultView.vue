<template>
  <div @click="contextMenuStore.toggleOff">
    Vaultview
    <vault-store :vault="vault" />
  </div>
</template>

<script setup lang="ts">
import { contextMenuStore } from "@/store/context-menu-store";
import { onMounted } from "vue";
//import { vaultStore } from "@/store/vault-store";
onMounted(async () => {
  contextMenuStore.toggleOff();
});
const vault = [
  {
    name: "Internet",
    id: "123",
    keys: [
      { id: "452", title: "Key1", username: "pop", urls: ["ok.de", "gmx.de"] },
      { id: "4523", title: "Key12", username: "alfred", urls: ["alfredo.de"] },
    ],
    subdirectorys: [
      {
        name: "Mail",
        id: "1234",
        keys: [],
        subdirectorys: [{ name: "Mailio", id: "1234", keys: [] }],
      },
    ],
  },
  {
    name: "Mail",
    id: "1234",
    keys: [],
    subdirectorys: [{ name: "Mail", id: "1234", keys: [] }],
  },
  {
    name: "Finanzen",
    id: "1235",
    keys: [],
    subdirectorys: [{ name: "Mail", id: "1234", keys: [] }],
  },
];
</script>