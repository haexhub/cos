<template>
  <div class="bg-background-focus rounded-md p-6 w-full">
    <div class="flex flex-col">
      <basic-input title="Name" type="text" v-model="name" />
    </div>

    <div class="flex justify-between pt-2">
      <basic-button class="
        bg-warning 
        hover:bg-warning-hover 
        focus:bg-warning-focus
      " @click="appStore.hideOverlay()">
        Abbrechen
      </basic-button>

      <basic-button @click="save">
        Speichern
      </basic-button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "@vue/reactivity";
import { IVaultDirectory, vaultStore } from "../../store/vault-store";
import { appStore } from "../../store/app-store";
import { onBeforeMount, onBeforeUpdate } from "@vue/runtime-core";

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  vaultId: {
    type: String,
    default: "",
  },

  directoryId: String,

  editMode: Boolean,

  onlyCreate: Boolean,

  parentDirectoryId: String
})

const name = ref("")
const editMode = ref(false);
const directory = reactive({} as IVaultDirectory)

const getDirectoryDetails = () => {
  if (props.directoryId)
    Object.assign(directory, JSON.parse(JSON.stringify(vaultStore.getKey(props.directoryId, props.vaultId))))
};

const save = async () => {
  if (props.onlyCreate) {
    const success = vaultStore.addDirectory(directory, props.directoryId, props.vaultId)
    if (success)
      await vaultStore.saveVault(props.vaultId)
  } else

    vaultStore.addDirectory({ name: name.value }, props.parentDirectoryId)

  appStore.hideOverlay()
}

onBeforeMount(() => {
  editMode.value = props.editMode;
  getDirectoryDetails();
});

onBeforeUpdate(() => {
  //editMode.value = props.editMode;
  getDirectoryDetails();
})
</script>