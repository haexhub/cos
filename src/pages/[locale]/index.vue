<template>
  <AppLayout>
    <div class="">
      <div class="flex flex-col items-center justify-center">
        <div
          class="w-full rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700"
        >
          <swiper-container ref="swiperContainer">
            <div slot="container-start">
              <div class="flex justify-between bg-secondary-600 rounded-t-lg">
                <button
                  class="p-3 text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white hover:bg-secondary-800 focus:bg-secondary-800 flex-1 border border-secondary-950 rounded-tl-lg flex space-x-2 justify-center items-center"
                  @click="swipePrevious"
                >
                  <IconAccountLogin class="w-6" />
                  <h1>{{ t('login') }}</h1>
                </button>

                <button
                  class="p-3 text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white hover:bg-secondary-800 focus:bg-secondary-800 flex-1 border border-secondary-950 rounded-tr-lg flex space-x-2 justify-center items-center"
                  @click="swipeNext"
                >
                  <IconAccountCreate class="w-6" />
                  <h1>{{ t('newAccount') }}</h1>
                </button>
              </div>
            </div>

            <swiper-slide>
              <Demo />
            </swiper-slide>

            <swiper-slide>
              <div class="p-4">
                <ButtonText
                  @click="chamberFile.open"
                  accept=".cos"
                  class="w-full"
                >
                  <div class="flex justify-center space-x-2">
                    <IconLogin class="w-4" />
                    <p class="">{{ t('load_key') }}</p>
                  </div>
                </ButtonText>
                <!-- <ButtonFile
                  @select:file="onOpenCosFile"
                  accept=".cos"
                  class="w-full"
                >
                  <div class="flex justify-center space-x-2">
                    <IconLogin class="w-4" />
                    <p class="">{{ t('load_key') }}</p>
                  </div>
                </ButtonFile> -->
              </div>
              {{ chamberFile?.file }}
              {{ chamberFile.data }}
            </swiper-slide>

            <swiper-slide>
              <form @submit.prevent="onCreateAccount">
                <div class="flex flex-col space-y-2 p-4">
                  <CosInput
                    :label="t('username')"
                    :placeholder="t('username')"
                    :schema="{
                      input: yup.string().trim().required().min(3).max(20),
                    }"
                    :showCopyButton="false"
                    :showEyeButton="false"
                    type="text"
                    v-model="newAccount.username"
                  />

                  <CosInput
                    :label="t('email')"
                    :placeholder="t('email')"
                    :schema="{
                      input: yup.string().trim().required().email(),
                    }"
                    :showCopyButton="false"
                    :showEyeButton="false"
                    type="text"
                    v-model="newAccount.email"
                  />

                  <CosInput
                    :label="t('password')"
                    :placeholder="t('password')"
                    :schema="{
                      input: yup.string().trim().required().min(8),
                    }"
                    :showCopyButton="false"
                    type="password"
                    v-model="newAccount.password"
                  />

                  <ButtonText type="submit">
                    <div class="flex justify-center space-x-2">
                      <IconKey class="w-4" />
                      <p>
                        {{ t('createAccount') }}
                      </p>
                    </div>
                  </ButtonText>
                </div>

                <div>{{ errorMessages }}</div>
              </form>
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
  //saveIndexDbToFile,
  loadChamberToIndexDb,
  openIndexDb,
  useChamber,
  createKeyPairAsync,
  exportCryptoKey,
} from '@/composables/composables'
import { ClientResponseError } from 'pocketbase'
import { Form } from 'vee-validate'
import * as yup from 'yup'

definePage({
  name: 'index',
})

const chamberFile = useFileSystemAccess({
  /* dataType,
    types: [
      {
        description: 'Chamber',
        accept: {
          'application/cos': ['.cos'],
        },
      },
    ],
    excludeAcceptAllOption: true, */
})

const loginAccount = reactive({
  encPair: '',
  pair: '',
  password: '',
})

const newAccount = reactive({
  username: '',
  password: '',
  email: '',
})

const errorMessages = ref()

const { t } = useI18n()

const swiperContainer = ref()

const swipeNext = () => {
  swiperContainer.value.swiper.slideNext()
}
const swipePrevious = () => {
  swiperContainer.value.swiper.slidePrev()
}

const onDownloadChamber = async () => {
  try {
  } catch (error) {
    console.log(error)
  }
}

const onCreateAccount = async () => {
  try {
    console.log('createKeyPair')
    const keyPair = await createKeyPairAsync()

    console.log(keyPair)
    const jwt = await exportCryptoKey(keyPair.privateKey)

    downloadFile(JSON.stringify(jwt), 'text', 'test.cos')
    const { createNewAccountAsync } = useUser()
    /* await createNewAccountAsync(
      newAccount.username,
      newAccount.email,
      newAccount.password
    ) */
  } catch (error) {
    errorMessages.value = (error as ClientResponseError).data
  }
}

const onOpenCosFile = async (event: any) => {
  console.log(event)

  //await openChamberAsync()
  //openIndexDb(JSON.parse(event))
  //setTimeout(() => loadChamberToIndexDb(JSON.parse(event)), 5000)

  /*     if (isEncPair(res)) {
      loginAccount.encPair = res
      loginAccount.pair = (await user.decryptAsync(
        loginAccount.encPair
      )) as string
    }
    loginAccount.encPair = event.target?.result?.toString() ?? '' */
}

const emit = defineEmits(['loginWithPassword', 'login'])
</script>

<i18n>
  {
    'de': {
      'alreadyExists': 'Habe bereits einen Account',
      'createAccount': 'Account erstellen',
      'createPair': 'Schlüssel anlegen',
      'load_key': 'Schlüssel laden',
      'login': 'Einloggen',
      'newAccount': 'Neuer Account',
      'password': 'Passwort',
      'username': 'Nutzername',
      "email": "E-Mail"
    },

    'en': {
      'alreadyExists': 'Already have an account',
      'createAccount': 'Sign Up',
      'createPair': 'Create key',
      'load_key': 'Load Key',
      'login': 'Login',
      'newAccount': 'New account',
      'password': 'Password',
      'username': 'Username',
      "email": "E-Mail"
    }

  }
</i18n>
