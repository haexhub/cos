<template>
  <div class="w-full">
    <label class="">{{ label }}</label>

    <div class="flex">

      <InputText :type="safePassword ? type : 'text'" :placeholder="placeholder" :modelValue="modelValue" @input="
        $emit('update:modelValue', $event.target.value)
        " />

      <div v-if="type === 'password'" class="inline-flex">
        <Button @click="safePassword = !safePassword">
          <template #icon>
            <IconEyeSlash v-if="safePassword" class="w-6" />

            <IconEye v-else class="w-6" />
          </template>
        </Button>
      </div>

      <Button :icon="copied ? 'pi pi-check' : 'pi pi-copy'" :class="copied ? 'p-button-success' : ''"
        class="p-button-outlined" @click="copy(modelValue?.toString() ?? '')" />
    </div>

    <slot> </slot>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from "@vueuse/core";

const { copy, copied } = useClipboard({});

defineProps({
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

const safePassword = ref(true);
const passwordMenu = [
  {
    label: "Update",
    icon: "pi pi-refresh",
    command: () => { },
  },
  {
    label: "Passwordgenerator",
    icon: "pi pi-times",
    command: () => { },
  },
];
defineEmits(["update:modelValue"]);
</script>
