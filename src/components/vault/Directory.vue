<template>
  <div class="mx-1">

    <button
      @click="selectDirectory(directoryId)"
      class="flex w-full border border-light-100 p-2 my-1
      text-directory
      hover:text-directory-hover

      hover:border-none
      focus:border-none
      focus:bg-background-focus hover:bg-background-hover
      hover:outline
      focus:outline

      transition
      ease-in-out
      "
    >
      <span class="
          w-full
          text-left
          
        ">
        {{ directory.name }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  watch,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
} from "vue";

import { useRouter, useRoute } from "vue-router";
import { contextMenuStore } from "@/store/context-menu-store.ts";
import { vaultStore } from "@/store/vault-store.ts";
import { IVaultDirectory } from "../../store/vault-store";

const props = defineProps({
  vaultId: {
    type: String,
    required: true,
  },
  directoryId: {
    type: String,
    default: "",
    required: true,
  },
});

const router = useRouter();
const directory = ref({} as IVaultDirectory);

const selectDirectory = (directoryId: string) => {
  router.push({
    hash: `#vaultId=${props.vaultId}&directoryId=${directoryId}`,
  });
};
onBeforeMount(() => {
  directory.value = vaultStore.getDirectory(props.vaultId, props.directoryId);
  //console.log("route", router.hash);
});

onMounted(async () => {
  //console.log("directory got ", await vaultStore.getDirectory(props.value));
});
</script>
