<template>
  <div>
    <div class="flex">
      <slot name="start"></slot>

      <div class="relative">
        <input v-if="isPassword" :id="id" :type="safe ? 'password' : 'text'" :placeholder="placeholder"
          :value="modelValue" @input="
            $emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          class="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 dark:text-white bg-transparent rounded-l-md border border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-primary-700 peer hover:ring-2 ring-secondary-300 transition ease-in-out duration-300" />

        <input v-else :id="id" :type="type" :placeholder="placeholder" :value="modelValue" @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          class="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 dark:text-white bg-transparent rounded-l-md border border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-primary-700 peer hover:ring-2 ring-secondary-300 transition ease-in-out duration-300" />

        <label :for="id"
          class="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-dark-900 px-2 peer-focus:px-2 peer-focus:text-primary-700  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer:top-2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
          {{ label }}
        </label>
      </div>

      <button v-if="isPassword" @click="safe = !safe"
        class="border border-primary-700 hover:text-lg p-2  hover:ring-2 ring-primary-700 transition ease-in-out duration-300">
        <IconEyeSlash v-if="safe" class="w-6 text-primary" />
        <IconEye v-else class="w-6 text-primary" />
      </button>

      <button :class="copied ? 'success text-success' : ''"
        class="border border-primary hover:text-lg p-2 rounded-r-md hover:ring-2 ring-primary transition ease-in-out  duration-300"
        @click="copy(modelValue?.toString() ?? '')">
        <IconClipboardCheck v-if="copied" class="w-6 text-primary" />
        <IconClipboard v-else class="w-6 text-primary" />
      </button>

      <slot name="end"></slot>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from "@vueuse/core";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ""
  },
  placeholder: String,
  label: String,
  type: {
    type: String,
    default: "text",
  },
});

const safe = ref(true);
const isPassword = computed(() => props.type === "password")

const { copy, copied } = useClipboard({});
const id = crypto.randomUUID()

defineEmits(["update:modelValue"]);
</script>
