<template>
  <div class="">
    <swiper-container>
      <swiper-slide>
        <template #header>
          <i class="pi pi-key px-2"></i>
          <span class="px-3">Übersicht</span>
        </template>

        <div class="flex justify-center md:min-w-lg min-w-sm">
          <div class="flex flex-col space-y-2 items-center">
            <div class="">
              <CosKeyText v-model="cosKey.title" placeholder="Titel" label="Titel" />

              <CosKeyText v-model="cosKey.username" placeholder="Nutzername" label="Nutzername" />

              <CosKeyText v-model="cosKey.password" placeholder="Password" label="Password" type="password" />

              <CosKeyUrl label="Url" v-model="cosKey.url" />
            </div>
          </div>
        </div>
      </swiper-slide>

      <swiper-slide>
        <template #header>
          <i class="pi pi-th-large px-2"></i>
          <span class="px-3">Eigenschaften</span>
        </template>

        <div class="flex flex-col space-y-4 md:min-w-lg min-w-sm">
          <div v-for="property in cosKey.properties" class="flex content-center flex-wrap md:flex-wrap">
            <CosKeyText placeholder="Schlüssel" v-model="property.key" />

            <CosKeyText placeholder="Wert" v-model="property.value" />
          </div>

          <div class="flex content-center flex-wrap md:flex-wrap">
            <CosKeyText placeholder="Schlüssel" v-model="newPropertyKey" />

            <CosKeyText placeholder="Wert" v-model="newPropertyValue" />
          </div>

          <div class="flex justify-end">
            <Button icon="pi pi-plus" class="p-button-rounded p-button-outlined p-button-success"
              @click="addNewProperty" />
          </div>
        </div>
      </swiper-slide>

      <swiper-slide>
        <template #header>
          <i class="pi pi-clock px-2"></i>
          <span class="px-3">Historie</span>
        </template>
      </swiper-slide>
    </swiper-container>

    <div class="p-4 flex justify-end space-x-2 mx-auto bg-card">
      <Button icon="pi pi-times" label="Abbrechen" class="p-button-danger" @click="$emit('close')" />
      <Button icon="pi pi-save" label="Speichern" @click="$emit('save', cosKey)" />
    </div>

    {{ cosKey }}
  </div>
</template>

<script setup lang="ts">
import { ICosKey } from 'composables/composables';



const _cosKey = ref({} as ICosKey);
const newPropertyKey = ref();
const newPropertyValue = ref();

const props = defineProps({
  cosKey: {
    type: Object as PropType<ICosKey>,
    default: () => ({
      id: crypto.randomUUID(),
      icon: "",
      title: "",
      username: "",
      password: "",
      description: "",
      url: "",
      properties: [],
    }),
  },
});

const addNewProperty = () => {
  const newProperty = {
    key: newPropertyKey.value,
    value: newPropertyValue.value,
  };

  props.cosKey.properties = [...props.cosKey.properties, newProperty];
  newPropertyKey.value = "";
  newPropertyValue.value = "";
};

defineEmits(["close", "save"]);
</script>
