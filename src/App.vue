<template>
  <div>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Chamber of Secrets',

  link: [{ rel: 'icon', type: 'image/vnd.microsoft.icon', href: '/logo.ico' }],

  meta: [{ name: 'description', content: 'Personal key vault.' }],
})

const observer = new MutationObserver((mutations, observer) => {
  console.log(mutations, observer)
})

observer.observe(document, {
  subtree: true,
  attributes: true,
})
</script>
