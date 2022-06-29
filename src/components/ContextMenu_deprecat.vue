<template>
  <div class="absolute z-10 bg-white">
    <nav
      id="context-menu"
      class="context-menu "
      :class="{ hidden: !visible }"
    >
      <ul class="context-menu__items">
        <li class="context-menu__item">
          <a
            href="#"
            class="context-menu__link"
            data-action="View"
          ><i class="fa fa-eye"></i> View Task</a>
        </li>
        <li class="context-menu__item">
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
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUpdated, onBeforeMount } from "vue";
import { contextMenuStore } from "@/store/context-menu-store";

const visible = ref(false);

onBeforeMount(async () => {
  await contextMenuStore.init();
  visible.value = await contextMenuStore.toggleOff();
});

const toggleOn = async () => {
  console.log("toggle contextmenu on");
  await contextMenuStore.toggleOff();
  visible.value = await contextMenuStore.toggleOn();
};

const toggleOff = async () => {
  console.log("toggle contextmenu off");
  visible.value = await contextMenuStore.toggleOff();
};

watch(
  () => contextMenuStore.state.show,
  function () {
    console.log("watch contextmenu", contextMenuStore.state.show);
    if (!contextMenuStore.state.show) {
      visible.value = false;
    }
  }
);

defineExpose({ visible, toggleOn, toggleOff });
</script>

<style scoped>
.menu {
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-secondary);
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(64, 64, 64, 0.15);
}
.menu-list {
  margin: 0;
  display: block;
  width: 100%;
  padding: 8px;
}
.menu-list + .menu-list {
  border-top: 1px solid #ddd;
}
.menu-sub-list {
  display: none;
  padding: 8px;
  background-color: var(--color-bg-secondary);
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(64, 64, 64, 0.15);
  position: absolute;
  left: 100%;
  right: 0;
  z-index: 100;
  width: 100%;
  top: 0;
  flex-direction: column;
}
.menu-sub-list:hover {
  display: flex;
}
.menu-item {
  position: relative;
}
.menu-button {
  font: inherit;
  border: 0;
  padding: 8px 8px;
  padding-right: 36px;
  width: 100%;
  border-radius: 8px;
  text-align: left;
  display: flex;
  align-items: center;
  position: relative;
  background-color: var(--color-bg-secondary);
}
.menu-button:hover {
  background-color: var(--color-bg-primary-offset);
}
.menu-button:hover + .menu-sub-list {
  display: flex;
}
.menu-button:hover svg {
  stroke: var(--color-text-primary);
}
.menu-button svg {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  stroke: var(--color-text-primary-offset);
}
.menu-button svg:nth-of-type(2) {
  margin-right: 0;
  position: absolute;
  right: 8px;
}
.menu-button--delete:hover {
  color: var(--color-red);
}
.menu-button--delete:hover svg:first-of-type {
  stroke: var(--color-red);
}
.menu-button--orange svg:first-of-type {
  stroke: var(--color-orange);
}
.menu-button--green svg:first-of-type {
  stroke: var(--color-green);
}
.menu-button--purple svg:first-of-type {
  stroke: var(--color-purple);
}
.menu-button--black svg:first-of-type {
  stroke: var(--color-black);
}
.menu-button--checked svg:nth-of-type(2) {
  stroke: var(--color-purple);
}
</style>