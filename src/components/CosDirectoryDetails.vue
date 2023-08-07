<template>
  <div class="bg-card md:min-w-lg min-w-sm py-4">
    <div class="flex flex-col space-y-4">
      <div class="flex space-x-2 items-center justify-center">
        <label>Ordnername</label>
        <InputText v-model="cosDirectory.name" />
      </div>

      <div class="flex space-x-2 justify-center">
        <Button class="p-button-danger" @click="$emit('close')">
          Abbrechen
        </Button>

        <Button @click="$emit('save', cosDirectory)"> Erstellen </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ICosDirectory } from 'composables/composables';



const props = defineProps({
  cosDirectory: {
    type: Object as PropType<ICosDirectory>,
    default: () => ({
      id: crypto.randomUUID(),
      name: "",
      directories: [],
      keys: [],
    }),
  },
});

defineEmits(["close", "save"]);
</script>
