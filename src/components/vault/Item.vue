<template>

  <button
    class="
      flex 
      w-full
      p-2
      transition
      ease-in-out
    "
    :class="[ 
      !isMarked ? defaultClass : '',
      isDirectory && !isMarked ? directoryClass: '', 
      
      isKey && !isMarked ? keyClass: '',
      
      isMarked ? markClass :''
    ]"
    @click.exact.prevent.stop="!isMarked ? select :''"
    @click.ctrl.prevent.stop="toogleMark"
  >
    <span class="
      w-full
      text-left
    ">
      {{ text }}
    </span>
  </button>

  <vault-overlay
    v-model="showDetails"
    @keyup.esc="showDetails = false"
  >
    <vault-key-details
      v-if="isKey"
      v-model="showDetails"
      :keyId="keyId"
      :vaultId="vaultId"
      @submit="saveKey"
    />

    <vault-directory-details
      v-if="isDirectory"
      v-model="showDetails"
      :directoryId="directoryId"
      :vaultId="vaultId"
    />

  </vault-overlay>
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
  console.log("marked");
  isMarked.value = true;
  if (isDirectory.value) {
    vaultStore.markItem(directory);
  } else {
    vaultStore.markItem(key);
  }
};

const unmark = () => {
  console.log("unmark");
  isMarked.value = false;
  if (isDirectory.value) {
    vaultStore.unmarkItem(directory);
  } else {
    vaultStore.unmarkItem(key);
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

const saveDirectory = () => {};

const saveKey = async (key: IVaultKey) => {
  try {
    await vaultStore.saveKey(props.vaultId, key);
  } catch (error) {}
};

const select = () => {
  if (isDirectory.value)
    router.push({
      hash: `#vaultId=${props.vaultId}&directoryId=${props.directoryId}`,
    });
  else if (isKey.value) {
    showDetails.value = true;
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

defineExpose({ unmark });
</script>
