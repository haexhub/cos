<template>
  <vault-overlay
    v-model="modelValue"
    class="p-12 "
  >
    <div class="bg-background-focus rounded-md p-6">
      <div class="flex flex-col">

        <basic-input
          title="Title"
          type="text"
          v-model="key.title"
        />

        <basic-input
          title="Nutzername"
          type="text"
          v-model="key.username"
        />

        <basic-input
          title="Passwort"
          type="password"
          v-model="key.password"
        />

        <div class="flex justify-between pt-2">
          <basic-button
            class="bg-warning"
            @click="$emit('update:modelValue', false)"
          >
            Abbrechen
          </basic-button>

          <basic-button @click="save">
            Speichern
          </basic-button>

        </div>

      </div>
    </div>
  </vault-overlay>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUpdate, reactive, ref } from "vue";
import { vaultStore } from "@/store/vault-store.ts";
import { IVaultKey } from "../../store/vault-store";

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

const width = ref("w-0");
const heigth = ref("h-0");
const opacity = ref("opacity-0");
const hidden = ref("");
const key = reactive({} as IVaultKey);

const show = () => {
  hidden.value = "";
  setTimeout(() => {
    width.value = "w-full";
    heigth.value = "h-full";
    opacity.value = "opacity-100";
  }, 10);
};

const close = () => {
  //emit("update:modelValue", false);

  width.value = "w-0";
  heigth.value = "h-0";
  opacity.value = "opacity-0";

  setTimeout(() => {
    hidden.value = "hidden";
  }, 1000);
};

const save = async () => {
  const success = await vaultStore.saveKey(props.vaultId, key);
  emit("update:modelValue", false);
};

const emit = defineEmits(["update:modelValue"]);

onBeforeMount(() => {
  Object.assign(key, vaultStore.getKey(props.vaultId, props.keyId));
});

onBeforeUpdate(() => {
  if (props.modelValue) show();
  else close();
});
</script>