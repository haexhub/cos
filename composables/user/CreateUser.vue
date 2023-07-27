<template>
  <div class="flex flex-col space-y-3 items-center bg-dark-900">
    <div>
      <span class="flex bg-yellow-200 w-full ">
        <CosInput v-model="user.name" placeholder="Nutzername" label="Nutzername" class="w-20" type="text" />

      </span>
      <!-- <div v-if="!isUserNameOk(username)" class="w-80">
          <p class="text-sm text-warning-400">
            Nutzername muss mindestens 3 Zeichen lang sein
          </p>
        </div> -->
    </div>

    <div>
      <!-- <Password
          v-model="password"
          placeholder="Password"
          toggleMask
          required
          :feedback="false"
          :class="{ 'p-invalid': !isPasswordOk(password) }"
          :minlength="6"
          inputClass="w-80"
          /> -->
      <!-- <div v-if="!isPasswordOk(password)" class="w-80">
          <p class="text-sm text-warning-400">
            Passwort muss mindestens 6 Zeichen lang sein
          </p>
        </div> -->
    </div>

    <Button @click="onCreateAccount" label="Account erstellen" icon="pi pi-user-plus" class="w-80" />

    <div class="space-y-2 items-center" :class="{ 'flex flex-col': showKeys }" :hidden="!showKeys">
      <!--  <PairInput :enc-pair="encPair" :pair="JSON.stringify(pair)" v-model:safePair="pass.safePair" class="w-full" /> -->

      <div v-if="file">
        <Button label="Datei speichern" icon="pi pi-save" @click="onSaveFile" />
      </div>

      <div v-else>
        <Button label="Datei speichern" icon="pi pi-save" @click="onSaveFileLegacy" />
      </div>

      <Button label="Ich habe meinen Schlüssel gespeichert!" class="p-button-secondary" @click="onSaveKeyConfirmation" />

      <SafeFileButton data="encPair" :file-name="user.name" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { email, required, minLength } from '@vuelidate/validators'

const user = reactive({
  name: "awd",
  password: ""
})

const rules = {
  name: { required, minLength },
  password: { required, minLength }
}
const v$ = useVuelidate(rules, user)

const showKeys = ref(false)
const file = ref()

const isUserNameOk = () => {

}

const onSaveFileLegacy = () => { }

const onSaveKeyConfirmation = () => { }

const onCreateAccount = () => { }

const onSaveFile = () => { }
</script>