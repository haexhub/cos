<template>

  <div class="
    bg-background-focus 
    rounded-md 
  ">
    <aside class="">
      <ul class="flex space-x-3 justify-center">

        <li>
          <basic-button @click="showInfo" class="flex justify-center">
            <Icon name="IconInfo" class="w-6" />
            <span class="">Allgemein</span>
          </basic-button>
        </li>
        <li v-if="!onlyCreate">
          <basic-button @click="showHistory" class="flex justify-center">
            <Icon name="IconHistory" class="w-6" />
            <span class="pl-2">History</span>
          </basic-button>
        </li>
      </ul>

    </aside>

    <main class="p-4">
      <transition :duration="500" enter-active-class="fade-in-left" leave-active-class="fade-out-right" mode="out-in">
        <div v-if="isHistory" class="">
          <ul class="">
            <li class="grid grid-cols-2">
              <span class="py-2 text-lg text-center">
                letzte Änderung
              </span>
              <span class="py-2 text-lg text-center">
                Title
              </span>
            </li>

            <li v-for="(history, index) in key.history" :key="history
            .last_modified
            ?.toString()" class="
                grid 
                grid-cols-2 
                rounded 
                transition 
                hover:ring
                hover:bg-background
              " @click="restoreKey(index)">

              <button class="text-center">
                {{
                    new Date(
                      history
                        .last_modified
                        ?.toString() || ""
                    )
                      ?.toLocaleDateString()
                }} - {{
    new Date(
      history
        .last_modified
        ?.toString() || ""
    )
      ?.toLocaleTimeString()
}}
              </button>

              <button class="text-left">
                {{ history.title }}
              </button>

            </li>
          </ul>

        </div>

        <div v v-else-if="isInfo">
          <div class="flex justify-end">

            <Icon v-show="!modelValue && !onlyCreate" name="IconPencil" class="w-6 "
              @click="$emit('update:modelValue', true)" />

            <Icon v-show="modelValue && !onlyCreate" name="IconPencilOff" class="w-6 "
              @click="$emit('update:modelValue', false)" />
          </div>

          <div class="flex flex-col">
            <basic-input v-show="key.title || modelValue" title="Title" type="text" v-model="key.title"
              :copyMode="!modelValue" :readonly="!modelValue" />

            <basic-input v-show="key.username || modelValue" title="Nutzername" type="text" v-model="key.username"
              :copyMode="!modelValue" :readonly="!modelValue" />

            <basic-input v-show="key.password || modelValue" title="Passwort" type="password" v-model="key.password"
              :copyMode="!modelValue" :readonly="!modelValue" />

            <basic-textarea v-show="key.description || modelValue" v-model="key.description" :copyMode="!modelValue"
              :readonly="!modelValue" title="Beschreibung"></basic-textarea>
          </div>
        </div>

      </transition>
    </main>

    <footer>
      <div class="flex justify-end p-4 space-x-4">
        <basic-button v-show="modelValue && !onlyCreate" class="
          bg-warning 
          hover:bg-warning-hover 
          focus:bg-warning-focus
        " @click="deleteKey">
          Löschen
        </basic-button>

        <basic-button @click="save" v-show="modelValue">
          Speichern
        </basic-button>

        <basic-button class="
          bg-warning 
          hover:bg-warning-hover 
          focus:bg-warning-focus
          " @click="appStore.hideOverlay()">
          Abbrechen
        </basic-button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUpdate, ref } from "vue";
import { appStore } from "../../store/app-store";
import { vaultStore, IVaultKey } from "../../store/vault-store";

const props = defineProps({
  keyId: {
    type: String,
    default: "",
  },

  vaultId: {
    type: String,
    default: "",
  },

  parentDirectoryId: {
    type: String
  },

  modelValue: Boolean,

  onlyCreate: Boolean
});

const key = ref({} as IVaultKey);
const modelValue = ref(false);

const isHistory = ref(false)
const isInfo = ref(true)

const save = () => {
  if (props.onlyCreate) {
    const success = vaultStore.addKey(key.value, props.parentDirectoryId, props.vaultId)
    if (success)
      vaultStore.saveVault(props.vaultId)
  }
  else
    vaultStore.saveKey(key.value)

  appStore.hideOverlay()
};

const getKeyDetails = () => {
  if (props.keyId)
    Object.assign(key.value, JSON.parse(JSON.stringify(vaultStore.getKey(props.keyId, props.vaultId))))
  else {
    key.value = vaultStore.createNewKey()
  }
  //console.log("KeyDetails", key.value)
  //console.log("keyId", props.keyId)
};

const deleteKey = () => {
  vaultStore.deleteKey(props.keyId, props.vaultId);
  appStore.hideOverlay()
};

const showInfo = (id: string) => {
  isInfo.value = true
  isHistory.value = false
}

const showHistory = () => {
  isInfo.value = false
  isHistory.value = true
}

const restoreKey = (index: number) => {
  const history = key.value.history
  Object.assign(key, key.value.history?.[index])
  key.value.history = history
}

onBeforeMount(() => {
  modelValue.value = props.modelValue;
  getKeyDetails();
});

onBeforeUpdate(() => {
  modelValue.value = props.modelValue;
  getKeyDetails();
});
</script>