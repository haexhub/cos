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
          " @click="$emit('update:modelValue', false)">
        Abbrechen
      </basic-button>

      <basic-button @click="save">
        Speichern
      </basic-button>

    </div>


  </div>
</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { vaultStore } from "../../store/vault-store";

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  parentDirectoryId: String
})

const name = ref("")

const save = () => {
  vaultStore.addDirectory({ name: name.value }, props.parentDirectoryId)
  emit("update:modelValue", false)
}
</script>