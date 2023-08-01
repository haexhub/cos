<template>
  <div class="relative">
    <div class="rounded-full overflow-hidden w-52 h-52 flex justify-center">
      <Image v-if="avatar" :src="avatar" width="200" />

      <i v-else class="pi pi-user" style="font-size: 10em"></i>
    </div>

    <div class="absolute bottom-4 -ml-8">
      <input
        type="file"
        class="hidden"
        ref="fileUpload"
        accept="image/png,image/jpg,image/webp"
        @change="uploadAvatar"
      />

      <Button
        class="p-button-sm"
        label="Upload"
        @click="
          //@ts-ignore
          $refs?.fileUpload.click()
        "
      >
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  avatar: String,
});

const emit = defineEmits(["update:avatar"]);

const uploadAvatar = (event: Event) => {
  const fileReader = new FileReader();
  fileReader.onloadend = (e) => {
    emit("update:avatar", e.target?.result);
  };
  //@ts-ignore
  fileReader.readAsDataURL(event.target.files[0]);
};
</script>
