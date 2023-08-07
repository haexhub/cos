<template>
  <div class="flex flex-col w-full space-y-2">
    <ButtonFile
      button-class="border-2 border-primary-400 px-2 py-3 text-primary-400 font-bold text-md rounded-md w-full bg-slate-900 hover:bg-slate-800 flex items-center min-w-50 text-center"
      @select:file="$emit('selectFile')"
      accept=".cos"
    >
      <IconFile class="w-4 min-w-4 ml-3" />

      <p class="w-full">Datei öffnen</p>
    </ButtonFile>
  </div>
</template>

<script setup lang="ts">
defineEmits(['select:file'])
</script>
