<template>
  <div>
    <!-- <div>
      <Avatar
        v-if="!user.is"
        icon="pi pi-user-plus"
        size="large"
        @click="toogleLoginDialog"
      />

      <Avatar v-else icon="pi pi-user" size="large" @click="toogleUserMenu" />
    </div> -->

    <!-- <OverlayPanel ref="accountPanel">
      <TabView>
        <TabPanel>
          <template #header>
            <i class="pi pi-sign-in px-2"></i>
            <span class="px-3">Einloggen</span>
          </template>

          <LoginUserDialog
            @loginWithPassword="onLoginWithPassword"
            @login="onLogin"
          />
        </TabPanel>

        <TabPanel>
          <template #header>
            <i class="pi pi-user-plus px-2"></i>
            <span class="px-3">Account erstellen</span>
          </template>

          <CreateUserDialog @savedKey="closePanel" />
        </TabPanel>
      </TabView>
    </OverlayPanel>

    <OverlayPanel ref="userPanel">
      <Button
        :label="user.profile.name + ' ' + 'ausloggen'"
        icon="pi pi-sign-out"
        class="p-button-text"
        @click="onLogout"
      />
    </OverlayPanel> -->
  </div>
</template>

<script setup lang="ts">
import { useUser } from '@/composables/user/composables'
import type { ISEAPair } from 'gun'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const accountPanel = ref()
const userPanel = ref()
const { login, loginWithPasswordAsync, leave } = useUser()

const toogleLoginDialog = (event: Event) => {
  try {
    accountPanel.value?.toggle(event)
  } catch (error) {
    console.log('ERROR', error)
  }
}

const toogleUserMenu = (event: Event) => {
  try {
    userPanel.value?.toggle(event)
  } catch (error) {
    console.log('ERROR', error)
  }
}
const closePanel = () => {
  console.log('hide')
  accountPanel.value?.hide()
}

const onLogin = (pair: ISEAPair) => {
  login(pair)
  closePanel()
  router.push('/profile')
}

const onLoginWithPassword = async (encPair: string, password: string) => {
  await loginWithPasswordAsync(encPair, password)
  closePanel()
  router.push('/profile')
}

const onLogout = () => {
  leave()
  userPanel.value.hide()
  router.push('/login')
}
</script>
