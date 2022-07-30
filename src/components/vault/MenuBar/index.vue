<template>
  <transition enter-active-class="slide-in-bottom" leave-active-class="slide-out-bottom">
    <div v-show="appStore.getState().isMenuBarVisible" class="
    bg-background-overlay
    fixed 
    bottom-0 
    left-0 
    w-full 
    h-12
    md:h-16 
    min-w-365px
  ">
      <button class="
      bg-primary
      relative 
      mx-auto
      transform
      rotate-45
      w-12
      md:w-16
      h-12
      md:h-16
      bottom-6
      md:bottom-8
      rounded
      block
      z-10
      hover:bg-primary-hover
      hover:ring
    " @click.stop="appStore.toogleSelectionMenu" @blur="appStore.hideSelectionMenu">
        <div class="-rotate-45 transform relative">
          <transition enter-active-class="slide-in-bottom" leave-active-class="slide-out-bottom">
            <slot></slot>

          </transition>

        </div>
        <!-- {{ appStore.getState() }} -->
        <Icon class="
          w-10
          mt-1
          md:w-12
          md:mt-1.5
          cursor-pointer 
          transform
          duration-300
        " :class="appStore.getState().iconClass" name="IconPlus" />
      </button>

      <div class="absolute top-0 w-full h-full mx-auto">
        <div class="
          flex 
          p-3 
          space-x-2
          md:p-4 
          md:space-x-4 
          justify-around 
          max-w-5xl 
          mx-auto
        ">
          <router-link to="/vault/view">
            <Icon name="IconDungeon" class="w-6 md:w-8 hover:text-primary" />
          </router-link>

          <router-link to="/message">
            <Icon name="IconMessage" class="w-6 md:w-8 hover:text-primary" />
          </router-link>

          <router-link to="/storage">
            <Icon name="IconSDCard" class="w-6 md:w-8 hover:text-primary" />
          </router-link>

          <router-link to="/calendar">
            <Icon name="IconCalendar" class="w-6 md:w-8 hover:text-primary" />
          </router-link>
        </div>
      </div>

      <!-- 
      <vault-overlay v-model="appStore.getState().isOverlayVisible">
        <slot name="overlay" />
      </vault-overlay> -->
    </div>
  </transition>


</template>

<script setup lang="ts">
import { reactive, ref, } from "@vue/reactivity";
import { onBeforeMount, onMounted } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import { appStore } from "../../../store/app-store";
import { vaultStore } from "../../../store/vault-store";

const route = useRoute()

const hashParams = vaultStore.extractHashParams(route.fullPath)


onBeforeMount(() => {
  //if (hashParams.)
})
</script>