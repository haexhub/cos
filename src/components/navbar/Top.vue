<template>
  <header class="w-full flex p-4 z-50 bg-gray-300 dark:bg-dark-950">
    <div class="w-full">
      <RouterLink
        to="/"
        class="flex flex-col sm:flex-row items-center justify-center"
      >
        <IconDungeon class="w-8 sm:w-12 text-primary-700" />
        <h1
          class="px-4 text-primary-700 font-logo text-lg sm:text-2xl font-extrabold"
        >
          Chamber of Secrets
        </h1>
      </RouterLink>
    </div>

    <div class="flex align-bottom justify-end space-x-2 p-2">
      <CosSelection
        v-model="locale"
        @update:model-value="onSwitchLanguage"
        class="h-12 w-18"
      >
        <option value="de">🇩🇪 de</option>

        <option value="en">🇬🇧 en</option>
      </CosSelection>

      <button
        class="w-12"
        @click="logout"
        v-if="user.auth"
      >
        <IconLogout class="dark:text-white" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useUser } from '@/composables/composables'
import { translation } from '@/i18n'
import router from '@/router'

const route = useRoute()
const { user } = useUser()
const { locale } = useI18n()

const onSwitchLanguage = (newLocale: string) => {
  translation.switchLanguage(newLocale)
  router.push(translation.i18nRoute(route))
}

const logout = () => {
  user.logout()
}
</script>
