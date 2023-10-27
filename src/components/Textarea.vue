<template>
  <textarea
    :placeholder="placeholder"
    :rows="rows"
    v-model="_modelValue"
    @change="onChange"
    @input="onInput"
    ref="textarea"
  >
  </textarea>
</template>

<script setup lang="ts">
const props = defineProps({
  autoResize: Boolean,
  modelValue: String,
  placeholder: String,
  rows: {
    type: Number,
    default: 3,
  },
})

const emit = defineEmits(['update:modelValue'])

const textarea = ref()

const _modelValue = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    emit('update:modelValue', newValue)
  },
})

const onChange = () => {
  if (props.autoResize) calculateSize()
}

const onInput = () => {
  if (props.autoResize) calculateSize()
}

const calculateSize = () => {
  if (textarea.value.scrollHeight > 30 * props.rows) {
    textarea.value.style.height = 0
    textarea.value.style.height = textarea.value.scrollHeight + 'px'
  } else {
    textarea.value.style.height = 30 * props.rows + 'px'
  }
}

onMounted(() => {
  for (let i = 0; i < textarea.value.length; i++) {
    textarea.value[i].setAttribute(
      'style',
      'height:' + textarea.value[i].scrollHeight + 'px;overflow-y:hidden;'
    )
  }
})
</script>
