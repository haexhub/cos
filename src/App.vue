<template>
  <app-layout class="manrope">
    <router-view />
  </app-layout>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onBeforeMount } from "vue";
import { vaultStore } from "@/store/vault-store";

onBeforeMount(async () => {
  await vaultStore.init();
});

onBeforeUnmount(async () => {
  await vaultStore.close();
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