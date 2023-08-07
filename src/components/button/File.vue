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
    <ButtonText
      @click="fileUpload.click()"
      v-bind="attr"
    >
      <slot />
    </ButtonText>
  </div>
</template>

<script setup lang="ts">
const attr = useAttrs()

defineProps({
  accept: {
    type: String,
    default: '*',
  },

  file: Object,

  label: {
    type: String,
    default: 'Datei öffnen',
  },
  multiple: Boolean,
})

const fileUpload = ref()

const onFileSelect = (event: Event) => {
  const fileReader = new FileReader()
  fileReader.onloadend = (e) => {
    emit('select:file', e.target?.result)
  }
  //@ts-ignore
  fileReader.readAsText(event?.target?.files[0])
}
const emit = defineEmits(['select:file'])
</script>
