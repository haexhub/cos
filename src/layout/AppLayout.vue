<template>
  <div class="
    bg-background
    h-screen 
    w-screen 
    text-slate-300
    min-h-screen min-w-screen
    manrope
  " @click="appStore.getState().isSelectionMenuVisible ? appStore.hideSelectionMenu() : ''">
    <div>
      <!--  <button
        class="p-2"
        @click="clearVaults"
      >Clear Vaults</button>
      <router-link to="/">Home</router-link> -->
    </div>
    <div class="min-w-365px max-w-5xl mx-auto">

      <slot></slot>
      <vault-menu-bar>
        <slot name="menuBar"></slot>
      </vault-menu-bar>
    </div>


    <vault-overlay v-model="appStore.getState().isOverlayVisible">
      <slot name="overlay"></slot>
    </vault-overlay>
  </div>
</template>

<script setup lang="ts">
import { appStore } from '../store/app-store';
</script>


