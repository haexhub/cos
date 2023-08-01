<template>
  <div class="bg-purple-300">
    <div class="h-full flex flex-col space-y-3 items-center">
      <div>
        <span class="inline-flex">
          <CosInput type="text" v-model="username" placeholder="Nutzername" class="w-80" />
          <IconPerson />
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

        <div v-if="file.isSupported.value">
          <Button label="Datei speichern" icon="pi pi-save" @click="onSaveFile" />
        </div>

        <div v-else>
          <Button label="Datei speichern" icon="pi pi-save" @click="onSaveFileLegacy" />
        </div>

        <Button label="Ich habe meinen Schlüssel gespeichert!" class="p-button-secondary"
          @click="onSaveKeyConfirmation" />

        <SafeFileButton data="encPair" :file-name="username" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  useUser
} from "@/composables/user/useUser";
import { useClipboard, useFileSystemAccess } from "@vueuse/core";

const dataType = ref("Text") as Ref<"Text" | "ArrayBuffer" | "Blob">;

const file = useFileSystemAccess({
  dataType,
  types: [
    {
      description: "cos",
      accept: {
        "text/plain": [".cos"],
      },
    },
  ],
  excludeAcceptAllOption: true,
});

const username = ref("");

const password = ref("");

const showKeys = ref(false);

const safePair = ref(true);

const onCreateAccount = async () => {
  const { user, createPairAsync } = useUser()
  /* if (!isPasswordOk(password.value) || !isUserNameOk(username.value)) {
    return;
  } */

  await createPairAsync();
  showKeys.value = true;
};

const onSaveFile = () => {
  //file.data.value = encPair.value;
  file.save({ suggestedName: username.value });
};

const onSaveFileLegacy = () => {
  const data = "encPair.value";
  const blob = new Blob([data], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  download(url, `${username.value}.cos`);
};

const onSaveKeyConfirmation = () => {
  emits("savedKey");
};

const download = (path: string, filename: string) => {
  // Create a new link
  const anchor = document.createElement("a");
  anchor.href = path;
  anchor.download = filename;

  // Append to the DOM
  document.body.appendChild(anchor);

  // Trigger `click` event
  anchor.click();

  // Remove element from DOM
  document.body.removeChild(anchor);
};

const displayPair = computed(() => {
  return safePair.value ? "encPair.value" : JSON.stringify("pair.value");
});

const emits = defineEmits(["savedKey"]);
</script>
