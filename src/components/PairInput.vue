<template>
  <div class="relative">
    <Textarea
      :value="displayPair"
      :autoResize="true"
      readonly
      v-bind="$attrs"
    />

    <Button
      class="absolute -ml-14 mt-2 p-button-icon"
      :icon="copied ? 'IconClipboard' : 'IconClipboardCheck'"
      @click="copy(displayPair)"
    />

    <Button
      class="absolute -ml-14 mt-15 p-button-icon"
      :icon="safePair ? '' : ''"
      @click="$emit('update:safePair', !safePair)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useClipboard } from "@vueuse/core";
//import { PrimeIcons } from "primevue/api";

const props = defineProps({
  encPair: {
    type: String,
    default: "",
  },

  pair: {
    type: String,
    default: "",
  },

  safePair: {
    type: Boolean,
    default: true,
  },
});

const { copy, copied } = useClipboard({});

const displayPair = computed(() => {
  return (props.safePair ? props.encPair : props.pair) ?? "";
});
</script>
