<template>
  <div class="w-screen h-screen flex flex-col overflow-hidden dark:bg-dark-950">
    <header>

      <NavbarTop>

      </NavbarTop>
    </header>

    <main class=" max-w-screen-lg overflow-auto flex-auto p-2">
      <slot></slot>
    </main>


    <footer>

      <Transition name="back" enter-active-class="animate__animated animate__backInUp"
        leave-active-class="animate__animated animate__backOutDown">

        <NavbarBottom v-show="bottomNavbar.isVisible">


        </NavbarBottom>
      </Transition>
    </footer>

  </div>
</template>



<script setup lang="ts">
import useNavbarBottom from '@/components/navbar/useNavbarBottom';

const { bottomNavbar } = useNavbarBottom()

console.log("bottomNavbar.isVisible", bottomNavbar.isVisible)
</script>

<style scoped></style>