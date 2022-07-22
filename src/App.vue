<template>
  <app-layout class="manrope">
    <router-view />
  </app-layout>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount } from "vue";
import { vaultStore } from "./store/vault-store";

onBeforeMount(async () => {
  await vaultStore.init();
  vaultStore.cleanupVaults();
});

onBeforeUnmount(() => vaultStore.cleanupVaults());
</script>

<style >
.manrope {
  font-family: "manrope";
}
@font-face {
  font-family: "manrope";
  src: url("@/assets/fonts/manrope/Manrope-Medium.woff2");
}

.expanse {
  font-family: "expanse";
}

@font-face {
  font-family: "expanse";
  src: url("@/assets/fonts/Expanse.otf");
}
</style>