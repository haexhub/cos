<template>

  <div class="bg-background-focus rounded-md px-6 w-full">
    <Icon
      name="IconEdit"
      class="w-6 absolute right-6 m-2"
      @click="editMode= true"
    />
    <div class="flex flex-col pt-6 pb-4">

      <basic-input
        title="Title"
        type="text"
        v-model="key.title"
      />

      <basic-input
        title="Nutzername"
        type="text"
        v-model="key.username"
      />

      <basic-input
        title="Passwort"
        type="password"
        v-model="key.password"
      />

      <div class="flex justify-between pt-2">
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

        <basic-button @click="save">
          Speichern
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
    /*    key.attributes = [];
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
  getKeyDetails();
});

onBeforeUpdate(() => {
  if (props.modelValue) show();
  else close();
});
</script>