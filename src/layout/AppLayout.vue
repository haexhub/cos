<template>
  <div class="
      bg-background
      h-screen 
      w-screen 
      text-slate-300
      min-h-screen min-w-screen
      ">
    <div>
      <!--  <button
        class="p-2"
        @click="clearVaults"
      >Clear Vaults</button>
      <router-link to="/">Home</router-link> -->
    </div>
    <div class="min-w-350px">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import { vaultStore } from "@/store/vault-store.ts";

const clearVaults = async () => {
  await vaultStore.clearVaults();
};

onBeforeMount(() => {});
</script>


