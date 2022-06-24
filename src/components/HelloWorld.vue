<script setup lang="ts">
import { ref } from "vue";
import { clickStore } from "../store/click-store";
import { onBeforeMount } from "vue";

defineProps<{ msg: string }>();
/* export default {
  setup() { */
onBeforeMount(async () => await clickStore.init());

const inc = () => {
  clickStore.incrementCount();

  // should throw a warning and don't mutate the store
  //clickStore.getState().count++;
};

const countState = clickStore.getState();
const isInitialized = clickStore.getIsInitialized();

/*   },
}; */

import { reactive, readonly } from "vue";

const count = ref(0);
</script>

<template>
  <h1 class='p-4 bg-red-400'>{{ msg }}</h1>

  <div v-if="isInitialized">
    <button @click="inc()">Clicked {{ countState.count }} times.</button>
  </div>

  <p>
    Recommended IDE setup:
    <a
      href="https://code.visualstudio.com/"
      target="_blank"
    >VS Code</a>
    +
    <a
      href="https://github.com/johnsoncodehk/volar"
      target="_blank"
    >Volar</a>
  </p>

  <p>See <code>README.md</code> for more information.</p>

  <p>
    <a
      href="https://vitejs.dev/guide/features.html"
      target="_blank"
    >
      Vite Docs
    </a>
    |
    <a
      href="https://v3.vuejs.org/"
      target="_blank"
    >Vue 3 Docs</a>
  </p>

  <button
    type="button"
    @click="count++"
  >count is: {{ count }}</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
