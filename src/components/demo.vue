<template>
  <div>
    <div class="flex justify-between">
      <Textarea
        class="w-full bg-slate-300"
        v-model="input"
      ></Textarea>

      <Textarea
        class="w-full bg-red-100"
        v-model="output"
      ></Textarea>

      <Textarea
        class="w-full bg-red-100"
        v-model="decode"
      ></Textarea>
    </div>
    <ButtonText @click="onCreateKey">create key</ButtonText>
    {{ key }}
    <ButtonText @click="onEncrypt">encrypt</ButtonText>
    <ButtonText @click="onDecrypt">decrypt</ButtonText>
  </div>
</template>

<script setup lang="ts">
import {
  createKeyPairAsync,
  decryptAsync,
  encryptAsync,
} from '@/composables/composables'

const input = ref()
const output = ref()
const decode = ref()
const key = ref()

const encrypted = ref()

const onEncrypt = async () => {
  const tt = await encryptAsync(input.value, key.value.publicKey)
  console.log('encrypted', tt)
  output.value = new Uint8Array(tt).toString() //

  encrypted.value = new Uint8Array(tt).toString()
}

const onDecrypt = async () => {
  const data = new Uint8Array(output.value.split(',')).buffer //new TextEncoder().encode(encrypted.value)

  console.log('data', data)
  const decrypted = await decryptAsync(data, key.value.privateKey)
  decode.value = decrypted
}

const onCreateKey = async () => {
  key.value = await createKeyPairAsync()
}
</script>
