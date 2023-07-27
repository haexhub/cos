<template>
  <div class="w-full flex justify-between absolute p-4 z-50 bg-white dark:bg-dark-950">
    <div>

    </div>

    <div>
      <NuxtLink :to="localePath('/')" class="flex items-center">
        <IconDungeon class="w-12 text-primary-700" />
        <h1 class="px-4 text-primary-700 font-logo text-2xl font-extrabold">Chamber of Secrets</h1>
      </NuxtLink>
    </div>

    <div>
      <CosSelection v-model="locale" @update:model-value="(e: string) => setLocale(e)">
        <option value="de">
          🇩🇪 de
        </option>

        <option value="en">
          🇬🇧 en
        </option>

      </CosSelection>
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n()
const localePath = useLocalePath()
</script>
