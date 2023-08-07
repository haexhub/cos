<template>
  <AppLayout>
    <div></div>
  </AppLayout>
</template>

<script setup lang="ts">
import useNavbarBottom from '@/components/navbar/useNavbarBottom'

const { bottomNavbar } = useNavbarBottom()
bottomNavbar.isVisible = true
</script>
