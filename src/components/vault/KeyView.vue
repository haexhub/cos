<template>
  <div
    class="
      absolute 
      top-0 
      transition-all 
      duration-1000
    "
    :class="[
      width, 
      opacity, 
      heigth, 
      hidden 
    ]"
  >
    <div class="
      ">
      {{ key}}
      <basic-input
        type="text"
        v-model.lazy="key.title"
      />
      {{ key.title}}
      {{key}}
      <button @click="
    close">Schließen</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  defineEmits,
  defineProps,
  onBeforeMount,
  onBeforeUpdate,
  reactive,
  ref,
} from "vue";
import { vaultStore } from "@/store/vault-store.ts";
import { IVaultDirectoryDB, IVaultKey } from "../../store/vault-store";

const props = defineProps({
  keyId: {
    type: String,
    default: "",
  },

  vaultId: {
    type: String,
    required: true,
  },

  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const test = ref("");
const width = ref("w-0");
const heigth = ref("h-0");
const opacity = ref("opacity-0");
const hidden = ref("");
const key = reactive({} as IVaultKey);

const show = () => {
  //Object.assign(key, vaultStore.getKey(props.vaultId, props.keyId));

  hidden.value = "";
  setTimeout(() => {
    width.value = "w-full";
    heigth.value = "h-full";
    opacity.value = "opacity-100";
  }, 10);
};

const close = () => {
  width.value = "w-0";
  heigth.value = "h-0";
  opacity.value = "opacity-0";
  setTimeout(() => {
    hidden.value = "hidden";
  }, 1000);

  emit("update:modelValue", false);
};
onBeforeMount(() => {
  Object.assign(key, vaultStore.getKey(props.vaultId, props.keyId));
});

onBeforeUpdate(() => {
  if (props.modelValue) show();
  else close();
});
</script>