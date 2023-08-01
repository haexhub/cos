<template>
  <div class="w-full flex justify-between p-4 z-50 bg-white dark:bg-dark-950 h-24">
    <div>

    </div>

    <div>
      <RouterLink to="/" class="flex items-center">
        <IconDungeon class="w-12 text-primary-700" />
        <h1 class="px-4 text-primary-700 font-logo text-2xl font-extrabold">Chamber of Secrets</h1>
      </RouterLink>
    </div>

    <div>
      <CosSelection v-model="locale" @update:model-value="(e: string) => locale = e">
        <option value="de">
          🇩🇪 de
        </option>

        <option value="en">
          🇬🇧 en
        </option>

      </CosSelection>
      {{ availableLocales }}
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale, availableLocales } = useI18n()
//const localePath = useLocalePath()
console.log("availableLocales", availableLocales)
</script>
