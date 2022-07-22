<template>
  <app-layout class="manrope">
    <router-view />
  </app-layout>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import { vaultStore } from "@/store/vault-store.ts";

onBeforeMount(async () => {
  await vaultStore.init();
  console.log("huhu");
  if (Object.keys(vaultStore.state.fileHandle).length < 1)
    vaultStore.clearVaults();
});
</script>

<style >
.manrope {
  font-family: "manrope";
}
@font-face {
  font-family: "manrope";
  src: url("@/assets/fonts/manrope/Manrope-Medium.woff2");
}
</style>