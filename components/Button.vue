<template>
  <button class="px-4 py-3 font-bold text-md rounded-md flex items-center min-w-50 text-center" @click="$emit('click')">
    <slot></slot>
  </button>
</template>
