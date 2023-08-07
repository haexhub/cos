<template>
  <div>
    <div class="h-16 bg-gray-300 dark:bg-dark-950">
      <div class="flex justify-center rounded-xl">
        <div class="h-16 flex w-1/2 items-center px-4">
          <slot name="start"></slot>
        </div>

        <div
          v-if="bottomNavbar.isActionButtonVisible"
          class="bg-primary-800 h-16 w-16 transform rotate-45 -mt-8 justify-center rounded-md"
        >
          <button
            ref="actionButton"
            type="button"
            class="text-primary-100 w-16 transform duration-300"
            :class="
              bottomNavbar.isActionButtonMenuVisible ? 'rotate-0' : 'rotate-45'
            "
            @click="
              bottomNavbar.isActionButtonMenuVisible =
                !bottomNavbar.isActionButtonMenuVisible
            "
          >
            <IconPlus />
          </button>
        </div>

        <div class="h-16 flex w-1/2 items-center justify-end px-4">
          <slot name="end"></slot>
        </div>
      </div>
    </div>
    <div
      class="w-32 mx-auto bg-transparent absolute bottom-16 mb-10 left-0 right-0 transition duration-500 ease-in-out"
      :class="
        bottomNavbar.isActionButtonMenuVisible ? 'opacity-100' : 'opacity-0'
      "
    >
      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 text-center">
        <li v-for="item in bottomNavbar.items">
          <RouterLink
            v-if="item.route"
            :to="item.route"
            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded"
            >{{ item.text }}
          </RouterLink>
          <a
            v-else
            :href="item.href"
            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded"
          >
            {{ item.text }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import useNavbarBottom from '@/components/navbar/useNavbarBottom'

const { bottomNavbar } = useNavbarBottom()
const actionButton = ref(null)

onClickOutside(
  actionButton,
  () => (bottomNavbar.isActionButtonMenuVisible = false)
)

const emit = defineEmits(['createKey', 'createDirectory'])
</script>
