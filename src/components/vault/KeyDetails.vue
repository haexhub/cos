<template>

  <div class="bg-background-focus rounded-md px-6 py-4 w-full">
    <div class="flex justify-end">

      <Icon
        v-show="!editMode"
        name="IconPencil"
        class="w-6 "
        @click="editMode= true"
      />

      <Icon
        v-show="editMode"
        name="IconPencilOff"
        class="w-6 "
        @click="editMode= false"
      />
    </div>

    <div class="flex flex-col">

      <basic-input
        title="Title"
        type="text"
        v-model="key.title"
        :copyMode="!editMode"
        :readonly="!editMode"
      />

      <basic-input
        title="Nutzername"
        type="text"
        v-model="key.username"
        :copyMode="!editMode"
        :readonly="!editMode"
      />

      <basic-input
        title="Passwort"
        type="password"
        v-model="key.password"
        :copyMode="!editMode"
        :readonly="!editMode"
      />

      <div class="flex justify-end pt-3 space-x-4">
        <basic-button
          v-show="editMode"
          class="
            bg-warning 
            hover:bg-warning-hover 
            focus:bg-warning-focus
          "
          @click="$emit('update:modelValue', false)"
        >
          Löschen
        </basic-button>

        <basic-button
          @click="save"
          v-show="editMode"
        >
          Speichern
        </basic-button>

        <basic-button
          class="
            bg-warning 
            hover:bg-warning-hover 
            focus:bg-warning-focus
          "
          @click="$emit('update:modelValue', false)"
        >
          Abbrechen
        </basic-button>
      </div>

    </div>
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

const show = () => {
  hidden.value = "";

  setTimeout(() => {
    width.value = "w-full";
    heigth.value = "h-full";
    opacity.value = "opacity-100";
  }, 10);
};

const close = () => {
  width.value = "w-0";
  heigth.value = "h-0";
  opacity.value = "opacity-0";

  setTimeout(() => {
    hidden.value = "hidden";
  }, 1000);
};

const save = async () => {
  emit("submit", key);
  emit("update:modelValue", false);
};

const getKeyDetails = () => {
  if (props.vaultId && props.keyId)
    Object.assign(key, vaultStore.getKey(props.vaultId, props.keyId));
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

onBeforeMount(() => {
  editMode.value = props.editMode;
  getKeyDetails();
});

onBeforeUpdate(() => {
  getKeyDetails();
  if (props.modelValue) show();
  else close();
});
</script>