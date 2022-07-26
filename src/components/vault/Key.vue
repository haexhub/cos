<template>
  <div class="mx-1">
    <button
      class="
      flex 
      w-full
      border 
      border-light-100
      p-2 
      text-key 
      
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
      @click.exact="showKeyView = true"
      @contextmenu="selectKey"
      @click.ctrl="selectKey"
    >
      <span class="
        w-full
        text-left
      ">
        {{ key.title }}
      </span>
    </button>
  </div>

  <vault-overlay
    v-model="showKeyView"
    @keyup.esc="showKeyView = false"
  >
    <vault-key-details
      :keyId="keyId"
      :vaultId="vaultId"
      v-model="showKeyView"
      @submit="saveKey"
    />
  </vault-overlay>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUpdate, reactive, ref } from "vue";
import { IVaultKey, vaultStore } from "../../store/vault-store";

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
const key = reactive({} as IVaultKey);

const getKeyDetails = () => {
  if (props.vaultId)
    Object.assign(key, vaultStore.getKey(props.keyId, props.vaultId));
};

const saveKey = async (key: IVaultKey) => {
  try {
    await vaultStore.saveKey(props.vaultId, key);
  } catch (error) {}
};

const selectKey = () => {
  console.log("long press");
};

onBeforeMount(() => getKeyDetails());

onBeforeUpdate(() => getKeyDetails());
</script>
