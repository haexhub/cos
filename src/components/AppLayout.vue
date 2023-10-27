<template>
  <div
    class="min-w-[340px] w-screen h-screen bg-gray-200 bg-gradient-to-b dark:bg-dark-950 dark:bg-gradient-to-b dark:from-dark-950 dark:to-dark-800"
  >
    <NavbarTop />

    <div class="mx-auto md:w-3/4 flex flex-col overflow-hidden h-full">
      <main class="flex-auto p-1">
        <slot></slot>
      </main>

      <footer>
        <Transition
          name="bottomNavbar"
          enter-active-class="animate__animated animate__backInUp"
          leave-active-class="animate__animated animate__backOutDown"
        >
          <NavbarBottom v-show="bottomNavbar.isVisible" />
        </Transition>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import useNavbarBottom from '@/components/navbar/useNavbarBottom'

const { bottomNavbar } = useNavbarBottom()
</script>

<style scoped></style>
