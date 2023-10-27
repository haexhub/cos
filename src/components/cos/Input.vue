<template>
  <div class="flex flex-col">
    <div class="flex">
      <slot name="start"></slot>

      <div class="relative w-full">
        <Field
          as="input"
          :class="
            showCopyButton || showEyeButton ? 'rounded-l-md' : 'rounded-md'
          "
          :id="id"
          :placeholder="placeholder"
          :type="safe ? 'password' : 'text'"
          class="bg-transparent dark:bg-gray-700 block px-2.5 pb-3 pt-4 w-full text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 appearance-none hover:border-primary-500 focus:ring-primary-600 focus:outline-none focus:ring-2 hover:ring-1 ring-primary-500 transition ease-in-out duration-200 peer"
          name="input"
          v-bind="attrs"
          v-if="isPassword"
          v-model="input"
        />

        <Field
          v-else
          as="input"
          :class="
            showCopyButton || showEyeButton ? 'rounded-l-md' : 'rounded-md'
          "
          :id="id"
          :placeholder="placeholder"
          :type="type"
          class="bg-transparent dark:bg-gray-700 block px-2.5 pb-3 pt-4 w-full text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 appearance-none hover:border-primary-500 focus:ring-primary-600 focus:outline-none focus:ring-2 hover:ring-1 ring-primary-500 transition ease-in-out duration-200 peer"
          name="input"
          v-bind="attrs"
          v-model="input"
        />

        <label
          :for="id"
          class="absolute text-sm text-gray-500 dark:text-white duration-200 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] bg-white dark:bg-dark-700 px-2 peer-focus:px-2 peer-focus:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer:top-4 peer-focus:top-4 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 rounded-1"
        >
          {{ label }}
        </label>
      </div>

      <button
        v-if="isPassword && showEyeButton"
        @click="safe = !safe"
        class="border border-gray-300 p-2 hover:ring-2 z-10 hover:border-primary-500 ring-primary-500 transition ease-in-out duration-200"
      >
        <IconEye
          v-if="safe"
          class="w-6 text-gray-700 dark:text-white"
        />
        <IconEyeSlash
          v-else
          class="w-6 text-gray-700 dark:text-white"
        />
      </button>

      <button
        v-show="showCopyButton"
        :class="copied ? 'success text-success' : ''"
        class="border border-gray-300 p-2 rounded-r-md hover:ring-2 hover:border-primary-500 ring-primary-500 transition ease-in-out duration-200"
        @click="copy(modelValue?.toString() ?? '')"
      >
        <IconClipboardCheck
          v-if="copied"
          class="w-6 text-gray-700 dark:text-white"
        />
        <IconClipboard
          v-else
          class="w-6 text-gray-700 dark:text-white"
        />
      </button>

      <slot name="end"></slot>
    </div>

    <ErrorMessage
      class="text-error"
      name="input"
    />
  </div>
</template>

<script setup lang="ts">
import { useForm, Field, ErrorMessage } from 'vee-validate'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  placeholder: String,

  label: String,

  name: {
    type: String,
    default: crypto.randomUUID(),
  },

  type: {
    type: String,
    default: 'text',
  },

  schema: {
    type: Object,
  },

  showEyeButton: {
    type: Boolean,
    default: true,
  },

  showCopyButton: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const input = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const attrs = useAttrs()

const { errors, defineInputBinds } = useForm({
  validationSchema: props.schema,
})

const safe = ref(true)
const isPassword = computed(() => props.type === 'password')

const { copy, copied } = useClipboard({})
const id = crypto.randomUUID()
</script>
