<template>
  <div class="">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { useUser } from './composables/composables';

const { params, path } = useRoute()

console.log("params", params, path)


useHead({
  title: 'Chamber of Secrets',

  link: [
    { rel: 'icon', type: 'image/vnd.microsoft.icon', href: '/logo.ico' }
  ],

  meta: [
    { name: 'description', content: 'Personal key vault.' },
  ],
})

const isAuth = ref(false)


const { user } = useUser()
isAuth.value = user.auth

</script>
