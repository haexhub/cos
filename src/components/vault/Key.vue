<template>
  <div class="mx-1">
    <button
      class="
      flex 
      w-full 
      border 
      border-light-100
      p-2 text-key 
      
      hover:border-none
      focus:border-none
      focus:bg-background-focus 
      hover:bg-background-hover
      hover:outline
      focus:outline
      transition
      ease-in-out

      hover:text-key-hover
      focus:text-key-focus
      "
      @click="showKeyView = true"
    >
      <span class="
        w-full
        text-left
      ">
        {{ key.title }}
      </span>
    </button>

    <vault-key-view
      class="text-black"
      :keyId="keyId"
      :vaultId="vaultId"
      v-model="showKeyView"
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import { IVaultKey } from "../../store/vault-store";
import { vaultStore } from "@/store/vault-store.ts";

const props = defineProps({
  vaultId: {
    type: String,
    required: true,
    default: "rootDirectory",
  },
  keyId: {
    type: String,
    required: true,
  },
});

const showKeyView = ref(false);
const key = ref({} as IVaultKey);

const openKeyView = (keyId: string) => {};
onBeforeMount(async () => {
  key.value = vaultStore.getKey(props.vaultId, props.keyId);
});
</script>
