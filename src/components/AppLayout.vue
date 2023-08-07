<template>
  <div
    class="w-screen h-screen bg-gray-200 bg-gradient-to-b bg-gray-100 dark:bg-dark-950 dark:bg-gradient-to-b dark:from-dark-950 dark:to-dark-800"
  >
    <div class="w-72 mx-auto sm:w-full flex flex-col overflow-hidden h-full">
      <NavbarTop />

      <main class="md:px-6 md:py-8 px-0 py-0 flex-auto">
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
