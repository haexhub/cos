<template>
  <ul class="flex flex-col ">
    <li class="p-1">
      <button
        class=""
        @click="emit('createDirectory')"
      >
        <!-- <span v-html="RawMdiAlarmOff" /> -->
        <!-- <Icon icon="mdi-light:home" /> -->
        Directory erstellen
      </button>
    </li>
    <!--  <li class="context-menu__item">
      <a
        href="#"
        class="context-menu__link"
        data-action="Edit"
      ><i class="fa fa-edit"></i> Edit Task</a>
    </li>
    <li class="context-menu__item">
      <a
        href="#"
        class="context-menu__link"
        data-action="Delete"
      ><i class="fa fa-times"></i> Delete Task</a>
    </li> -->
  </ul>
</template>

<script setup lang="ts">
//import RawMdiAlarmOff from "~icons/mdi/alarm-off?raw&width=1em&height=1em";
const emit = defineEmits(["createDirectory"]);
//defineExpose(emit);
</script>