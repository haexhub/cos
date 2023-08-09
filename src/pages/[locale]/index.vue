<template>
  <AppLayout>
    <div class="">
      <div class="flex flex-col items-center justify-center">
        <div
          class="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
        >
          <swiper-container ref="swiperContainer">
            <div slot="container-start">
              <div class="flex justify-between bg-secondary-600 rounded-t-lg">
                <button
                  class="p-3 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white hover:bg-secondary-800 focus:bg-secondary-800 flex-1 border border-secondary-950 rounded-tl-lg flex space-x-2 justify-center"
                  @click="swipePrevious"
                >
                  <IconAccountLogin class="w-6" />
                  <h1>{{ t('login') }}</h1>
                </button>
                <button
                  class="p-3 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white hover:bg-secondary-800 focus:bg-secondary-800 flex-1 border border-secondary-950 rounded-tr-lg flex space-x-2 justify-center"
                  @click="swipeNext"
                >
                  <IconAccountCreate class="w-6" />
                  <h1>{{ t('newAccount') }}</h1>
                </button>
              </div>
            </div>

            <swiper-slide>
              <div class="p-4">
                <ButtonFile
                  @select:file="onOpenCosFile"
                  accept=".cos"
                  class="w-full"
                >
                  <div class="flex justify-center space-x-2">
                    <IconLogin class="w-4" />
                    <p class="">{{ t('load_key') }}</p>
                  </div>
                </ButtonFile>
              </div>
            </swiper-slide>

            <swiper-slide>
              <div class="flex flex-col space-y-2 p-4">
                <CosInput
                  :label="t('username')"
                  :placeholder="t('username')"
                  :showCopyButton="false"
                  :showEyeButton="false"
                  type="text"
                  v-model="newAccount.username.value"
                  v-bind="newAccount.username"
                />
                <span
                  v-show="errors.username"
                  class="text-error"
                >
                  {{ errors.username }}
                </span>

                <CosInput
                  :label="t('password')"
                  :placeholder="t('password')"
                  :showCopyButton="false"
                  type="password"
                  v-model="newAccount.password.value"
                  v-bind="newAccount.password"
                />
                <span
                  v-show="errors.password"
                  class="text-error"
                >
                  {{ errors.password }}
                </span>

                <ButtonText @click="onDownloadChamber">
                  <div class="flex justify-center space-x-2">
                    <IconKey class="w-4" />
                    <p>
                      {{ t('createAccount') }}
                    </p>
                  </div>
                </ButtonText>
              </div>
            </swiper-slide>
          </swiper-container>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import {
  downloadFile,
  useUser,
  saveIndexDbToFile,
  loadChamberToIndexDb,
  openIndexDb,
} from '@/composables/composables'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

definePage({
  name: 'index',
})

const schema = yup.object({
  username: yup.string().trim().required().min(3).max(20),
  password: yup.string().trim().required().min(4, 'mindestens 4 zeichen'),
})

const { errors, defineInputBinds } = useForm({
  validationSchema: schema,
})

const { createPairAsync, login, updateProfileAsync, user, isEncPair } =
  useUser()

const pair = ref()

const loginAccount = reactive({
  encPair: '',
  pair: '',
  password: '',
})

const newAccount = reactive({
  username: defineInputBinds('username'),
  password: defineInputBinds('password'),
})

const { t } = useI18n()

const swiperContainer = ref()
const swipeNext = () => {
  swiperContainer.value.swiper.slideNext()
}
const swipePrevious = () => {
  swiperContainer.value.swiper.slidePrev()
}

const onDownloadChamber = async () => {
  const pair = await createPairAsync()
  login(pair)
  await updateProfileAsync('username', newAccount.username.value)
  await updateProfileAsync('pair', pair)

  saveIndexDbToFile()
}

const onLogin = async () => {
  /* if (_isEncPair.value) {
    emit('loginWithPassword', pair.value, password.value)
  } else {
    emit('login', pair.value)
  } */
}

const onOpenCosFile = async (event: any) => {
  console.log(event)
  openIndexDb(JSON.parse(event))
  //setTimeout(() => loadChamberToIndexDb(JSON.parse(event)), 5000)

  /*     if (isEncPair(res)) {
      loginAccount.encPair = res
      loginAccount.pair = (await user.decryptAsync(
        loginAccount.encPair
      )) as string
    }
    loginAccount.encPair = event.target?.result?.toString() ?? '' */
}

const onClearPair = () => {
  //pair.value = '';
}

const emit = defineEmits(['loginWithPassword', 'login'])
</script>

<i18n>
  {
    'de': {

      'alreadyExists': 'Habe bereits einen Account',
      'createAccount': 'Account erstellen',
      'newAccount': 'Neuer Account',
      'createPair': 'Schlüssel anlegen',
      'load_key': 'Schlüssel laden',
      'login': 'Einloggen',
      'password': 'Passwort',
      'username': 'Nutzername',
    },

    'en': {
      'alreadyExists': 'Already have an account',
      'createAccount': 'Sign Up',
      'newAccount': 'New account',
      'createPair': 'Create key',
      'load_key': 'Load Key',
      'login': 'Login',
      'password': 'Password',
      'username': 'Username',
    }

  }
  

</i18n>
