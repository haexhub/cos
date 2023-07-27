<template>
  <div class="w-full fixed bottom-0 bg-dark-800">

    <div class="flex justify-center rounded-xl">

      <div class="h-16 flex w-1/2 items-center px-4">
        <slot name="start"></slot>
      </div>

      <div v-if="actionMenu.isButtonVisible"
        class="bg-primary-800 h-16 w-16 transform rotate-45 -mt-8 justify-center rounded-md ">
        <button ref="actionButton" type="button" class="text-primary-100 w-16 transform duration-300"
          :class="actionMenu.isMenuVisible ? 'rotate-0' : 'rotate-45'"
          @click="actionMenu.isMenuVisible = !actionMenu.isMenuVisible">
          <IconPlus />
        </button>
      </div>

      <div class="h-16 flex w-1/2 items-center justify-end px-4">
        <slot name="end"></slot>
      </div>
    </div>

  </div>
  <div class="w-32 mx-auto bg-transparent absolute bottom-16 mb-10 left-0 right-0 transition duration-500 ease-in-out"
    :class="actionMenu.isMenuVisible ? 'opacity-100' : 'opacity-0'">

    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 text-center">
      <li v-for="item in actionMenu.items">
        <NuxtLink v-if="item.route" :to="localePath(item.route)"
          class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded">{{ item.text }}
        </NuxtLink>
        <a v-else :href="item.href"
          class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded">
          {{ item.text }}
        </a>
      </li>
    </ul>

  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const localePath = useLocalePath()
const { actionMenu } = useActionMenu()
const actionButton = ref(null)

onClickOutside(actionButton, () => actionMenu.isMenuVisible = false)

const emit = defineEmits(["createKey", "createDirectory"]);
</script>
