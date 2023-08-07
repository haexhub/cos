<template>
  <div class="flex content-center space-x-4">
    <span class="my-auto w-28 hidden xs:block md:w-36 lg:w-44">
      <label for="value">{{ label }}</label>
    </span>

    <div class="w-68 md:w-80 lg:w-96">
      <div class="p-inputgroup">
        <InputText
          id="value"
          type="text"
          :placeholder="placeholder"
          :value="modelValue"
          @input="
            //@ts-ignore
            $emit('update:modelValue', $event.target.value)
          "
        />

        <Button
          icon="pi"
          class="p-button-outlined"
          @click="openLink"
          v-tooltip="'Seite in neuem Tab öffnen'"
        >
          <IconLink class="w-6" />
        </Button>

        <Button
          :icon="copied ? 'pi pi-check' : 'pi pi-copy'"
          :class="copied ? 'p-button-success' : ''"
          class="p-button-outlined"
          @click="copy(modelValue ?? '')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from "@vueuse/core";

const { copy, copied } = useClipboard({});

const props = defineProps({
  modelValue: String,
  placeholder: {
    type: String,
    default: "Url",
  },
  label: String,
});

const openLink = () => {
  window.open(props.modelValue, "_blank");
};

defineEmits(["update:modelValue"]);
</script>
