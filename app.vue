<template>
  <div>
    <NuxtPage v-if="isAuth" />
    <Login v-else />
  </div>
</template>






<script setup lang="ts">
const { locale } = useI18n()
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

onMounted(() => {
  const { user } = useUser()
  isAuth.value = user.auth
})
</script>

