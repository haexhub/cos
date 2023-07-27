<template>
  <div class="w-full">
    <input
      type="file"
      class="hidden"
      ref="fileUpload"
      :accept="accept"
      @change="onFileSelect"
      :multiple="multiple"
    />

    <button
      :class="buttonClass"
      @click="
        //@ts-ignore
        $refs?.fileUpload.click()
      "
    >
      <slot />
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  accept: {
    type: String,
    default: "*",
  },
  buttonClass: String,
  file: Object,
  label: {
    type: String,
    default: "Datei öffnen",
  },
  multiple: Boolean,
});

const emit = defineEmits(["select:file"]);

const onFileSelect = (event: Event) => {
  const fileReader = new FileReader();
  fileReader.onloadend = (e) => {
    emit("select:file", e.target?.result);
  };
  //@ts-ignore
  fileReader.readAsDataURL(event.target.files[0]);
};
</script>
