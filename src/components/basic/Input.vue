<template>
  <div class="flex-col py-1 text-slate-200">
    <div class="p-1 rounded text-sm ">{{ title }}</div>

    <input
      :type="currentType"
      :value="modelValue"
      class="
        bg-background 
        p-1.5 
        rounded 
        w-full
        focus:border-none
      "
      @input="$emit('update:modelValue', handleInput($event))"
    />
    <Icon
      v-if="type === 'password' && currentType ==='password'"
      name="IconEye"
      class="w-6 pt-1.5 bg-background absolute right-10"
      @click="currentType ='text'"
    />
    <Icon
      v-if="type === 'password' && currentType ==='text'"
      name="IconEyeOff"
      class="w-6 pt-1.5 bg-background absolute right-10"
      @click="currentType ='password'"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";

const props = defineProps({
  title: String,

  type: {
    type: String,
    default: "text",
  },

  modelValue: {
    type: String || Number,
    default: "",
  },
});

const currentType = ref("");

const handleInput = (event: Event) => {
  return (event.target as HTMLInputElement).value;
};

onBeforeMount(() => {
  currentType.value = props.type;
});
</script>