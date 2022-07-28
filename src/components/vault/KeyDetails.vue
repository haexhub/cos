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
        <li>
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
                last modified
              </span>
              <span class="py-2 text-lg text-center">
                title
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

            <Icon v-show="!editMode" name="IconPencil" class="w-6 " @click="editMode = true" />

            <Icon v-show="editMode" name="IconPencilOff" class="w-6 " @click="editMode = false" />
          </div>

          <div class="flex flex-col">
            <basic-input v-show="key.title || editMode" title="Title" type="text" v-model="key.title"
              :copyMode="!editMode" :readonly="!editMode" />

            <basic-input v-show="key.username || editMode" title="Nutzername" type="text" v-model="key.username"
              :copyMode="!editMode" :readonly="!editMode" />

            <basic-input v-show="key.password || editMode" title="Passwort" type="password" v-model="key.password"
              :copyMode="!editMode" :readonly="!editMode" />

            <basic-textarea v-show="key.description || editMode" v-model="key.description" :copyMode="!editMode"
              :readonly="!editMode" title="Beschreibung"></basic-textarea>
          </div>
        </div>

      </transition>

    </main>

    <footer>
      <div class="flex justify-end p-4 space-x-4">
        <basic-button v-show="editMode" class="
            bg-warning 
            hover:bg-warning-hover 
            focus:bg-warning-focus
          " @click="deleteKey">
          Löschen
        </basic-button>

        <basic-button @click="save" v-show="editMode">
          Speichern
        </basic-button>

        <basic-button class="
            bg-warning 
            hover:bg-warning-hover 
            focus:bg-warning-focus
          " @click="$emit('update:modelValue', false)">
          Abbrechen
        </basic-button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUpdate, reactive, ref } from "vue";
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

  modelValue: {
    type: Boolean,
    default: false,
  },

  editMode: Boolean,
});

const emit = defineEmits(["update:modelValue", "submit"]);

const width = ref("w-0");
const heigth = ref("h-0");
const opacity = ref("opacity-0");
const hidden = ref("");
const key = reactive({} as IVaultKey);
const editMode = ref(false);

const isHistory = ref(false)
const isInfo = ref(true)

const showDetails = () => {
  hidden.value = "";

  setTimeout(() => {
    width.value = "w-full";
    heigth.value = "h-full";
    opacity.value = "opacity-100";
  }, 10);
};

const hideDetails = () => {
  width.value = "w-0";
  heigth.value = "h-0";
  opacity.value = "opacity-0";

  setTimeout(() => {
    hidden.value = "hidden";
  }, 1000);
};

const save = () => {
  emit("submit", key);
  //emit("update:modelValue", false);
};

const getKeyDetails = () => {
  if (props.vaultId && props.keyId)
    Object.assign(key, JSON.parse(JSON.stringify(vaultStore.getKey(props.keyId, props.vaultId))))
  else {
    /* key.attributes = [];
    key.description = "";
    key.history = [];
    key.id = "";
    key.password = "";
    key.title = "";
    key.urls = [];
    key.username = ""; */
  }
};

const deleteKey = () => {
  vaultStore.deleteKey(props.keyId, props.vaultId);
  emit("update:modelValue", false);
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
  const history = key.history
  Object.assign(key, key.history?.[index])
  key.history = history
}

onBeforeMount(() => {
  editMode.value = props.editMode;
  getKeyDetails();
});

onBeforeUpdate(() => {
  if (props.modelValue) showDetails();
  else hideDetails();
});
</script>