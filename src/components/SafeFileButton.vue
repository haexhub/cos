<template>
  <div v-if="file.isSupported.value">
    <Button
      label="als Datei speichern"
      icon="pi pi-download"
      @click="onSaveFile"
    />
  </div>

  <div v-else>
    <Button
      label="als Datei speichern"
      icon="pi pi-download"
      @click="onSaveFileLegacy"
    />
  </div>
</template>

<script setup lang="ts">
import { useFileSystemAccess } from "@vueuse/core";
import { ref, Ref } from "vue";

const props = defineProps({
  fileName: String,
  data: String,
});

const dataType = ref("Text") as Ref<"Text" | "ArrayBuffer" | "Blob">;

const file = useFileSystemAccess({
  dataType,
  types: [
    {
      description: "cos",
      accept: {
        "text/plain": [".cos"],
      },
    },
  ],
  excludeAcceptAllOption: true,
});

const onSaveFile = () => {
  file.data.value = props.data;
  file.save({ suggestedName: props.fileName });
};

const onSaveFileLegacy = () => {
  const data = props.data ?? "";
  const blob = new Blob([data], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  download(url, `${props.fileName}.cos`);
};

const download = (path: string, filename: string) => {
  // Create a new link
  const anchor = document.createElement("a");
  anchor.href = path;
  anchor.download = filename;

  // Append to the DOM
  document.body.appendChild(anchor);

  // Trigger `click` event
  anchor.click();

  // Remove element from DOM
  document.body.removeChild(anchor);
};
</script>
