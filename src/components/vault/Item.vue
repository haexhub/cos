<template>

  <button class="
      flex 
      w-full
      p-2
      transition
      ease-in-out
    " :class="[
      !isMarked ? defaultClass : '',
      isDirectory && !isMarked ? directoryClass : '',
    
      isKey && !isMarked ? keyClass : '',
    
      isMarked ? markClass : ''
    ]" @click.exact="!isMarked ? select() : toogleMark()" @click.ctrl.stop="toogleMark"
    @contextmenu.prevent="toogleMark">
    <span class="
      w-full
      text-left
    ">
      {{ text }}
    </span>
  </button>

  <!--  <vault-overlay v-model="showDetails" @keyup.esc="showDetails = false">
    <vault-key-details v-show="isKey" v-model="showDetails" :keyId="keyId" :vaultId="vaultId" @submit="saveKey" />

    <vault-directory-details v-show="isDirectory" v-model="showDetails" :directoryId="directoryId" :vaultId="vaultId" />

  </vault-overlay> -->
</template>

<script setup lang="ts">
import { values } from "idb-keyval";
import { ref, onBeforeMount, onMounted, onBeforeUpdate, reactive } from "vue";

import { useRouter, useRoute } from "vue-router";
import {
  vaultStore,
  IVaultDirectory,
  IVaultKey,
} from "../../store/vault-store";

const props = defineProps({
  vaultId: {
    type: String,
    required: true,
  },
  directoryId: {
    type: String,
    default: "",
  },
  keyId: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["editKey"])

const router = useRouter();

const directory = reactive({} as IVaultDirectory);
const key = reactive({} as IVaultKey);

const showDetails = ref(false);

const isMarked = ref(false);
const isDirectory = ref(false);
const isKey = ref(false);

const defaultClass =
  "border border-slate-200 focus:border-none focus:bg-background-focus focus:outline hover:border-none hover:bg-background-hover hover:outline";
const directoryClass =
  "text-directory hover:text-directory-hover focus:text-directory-hover";
const markClass = "ring ring-red-200";
const keyClass = "text-key hover:text-key-hover focus:text-key-focus";

const text = ref("");

const mark = () => {
  //console.log("mark", props.keyId || props.directoryId);
  isMarked.value = true;

  if (isDirectory.value) {
    vaultStore.markItem({ directoryId: directory.id });
  } else {
    vaultStore.markItem({ keyId: key.id });
  }
};

const unmark = () => {
  //console.log("unmark");
  isMarked.value = false;

  if (isDirectory.value) {
    vaultStore.unmarkItem({ directoryId: directory.id });
  } else {
    vaultStore.unmarkItem({ keyId: key.id });
  }
};

const toogleMark = () => {
  if (isMarked.value) {
    unmark();
  } else {
    mark();
  }
};

const getDirectoryDetails = () => {
  if (props.vaultId && props.directoryId) {
    isDirectory.value = true;
    isKey.value = false;

    Object.assign(
      directory,
      vaultStore.getDirectory(props.directoryId, props.vaultId)
    );

    text.value = directory.name || "";
  }
};

const getKeyDetails = () => {
  if (props.vaultId && props.keyId) {
    isDirectory.value = false;
    isKey.value = true;

    Object.assign(key, vaultStore.getKey(props.keyId, props.vaultId));
    text.value = key.title || "";
  }
};

const saveDirectory = async () => {
  try {
    await vaultStore.saveDirectory(directory)
  } catch (error) {

  }
};

const saveKey = async (key: IVaultKey) => {
  try {
    console.log("item savekey", key)
    await vaultStore.saveKey(key);
  } catch (error) {
    console.log("ERROR Item saveKey", error)
  }
};

const select = () => {
  if (isDirectory.value)
    router.push({
      hash: `#vaultId=${props.vaultId}&directoryId=${props.directoryId}`,
    });
  else if (isKey.value) {
    console.log("editKey", key)
    emit("editKey", key)
  }
};

onBeforeMount(() => {
  getDirectoryDetails();
  getKeyDetails();
});

onBeforeUpdate(() => {
  getKeyDetails();
  getDirectoryDetails();
});

defineExpose({ mark, unmark, id: props.directoryId || props.keyId });
</script>
