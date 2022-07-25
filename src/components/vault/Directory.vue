<template>

  <button
    @click.exact="selectDirectory(directoryId)"
    class="flex w-full border border-light-100 p-2
      text-directory
      hover:text-directory-hover

      hover:border-none
      focus:border-none
      focus:bg-background-focus 
      hover:bg-background-hover
      hover:outline
      focus:outline

      transition
      ease-in-out
      "
    @contextmenu="select"
    @click.ctrl="select"
  >
    <span class="
          w-full
          text-left
          
        ">
      {{ directory.name }}
    </span>
  </button>

  <vault-overlay
    v-model="showDirectoryDetails"
    @keyup.esc="showDirectoryDetails = false"
  >
    <vault-directory-details />
  </vault-overlay>
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
import { vaultStore, IVaultDirectory } from "../../store/vault-store";

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
const showDirectoryDetails = ref(false);

const select = () => {
  console.log("select directory");
};

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
