<template>
  <div class="bg-card px-4">
    <div class="justify-center flex">
      <ProfileAvatar v-model:avatar="user.name" />
    </div>

    <div class="flex flex-col gap-2">
      <CosKeyText label="Nutzername"></CosKeyText>
      <CosKeyText label="Nutzernameawdawdawdawd"></CosKeyText>
      <div>
        <div class="p-inputgroup">
          <InputText v-model="user.name" placeholder="Nutzername" />

          <span class="p-inputgroup-addon">
            <i class="pi pi-user"></i>
          </span>
        </div>

        <!-- <div v-if="!isUserNameOk(user.profile.name)" class="px-2">
          <p class="text-sm text-warning-400">
            Nutzername muss mindestens 3 Zeichen lang sein
          </p>
        </div> -->
      </div>

      <!-- <span class="p-inputgroup">
        <InputText v-model="user.safe.pass" :type="pass. ? 'text' : 'password'" />
        <span class="p-inputgroup-addon">
          <i class="pi cursor-pointer" :class="pass.show ? 'pi-eye-slash' : 'pi-eye'" @click="pass.show = !pass.show" />
        </span>
      </span>

      <span v-if="!isPasswordOk" class="text-sm text-warning-400 px-2">Passwot muss mindestens {{ pass.minLength }}
        Zeichen lang sein
      </span>

      <PairInput :enc-pair="pass.safe.encPair ?? ''" :pair="JSON.stringify(user.pair())" v-model:safePair="pass.safePair"
        class="w-full" />
    </div>

    <div class="flex gap-2 justify-center mt-4">
      <Button icon="pi pi-save" label="Änderungen übernehmen" @click="onSaveProfile" :disabled="!isPasswordOk" />

      <SafeFileButton :data="pass.safe.encPair ?? ''" :file-name="user.profile.name" />
    </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAvatar, useUser } from "@/composables/user/composables";


const { updateProfile, user } = useUser()


const onSaveProfile = () => {
  updateProfile("name", user.name);
  //updateProfile("avatar", user.avatar);

  /* if (pass.input != user.profile.password) {
    pass.set();
    user.profile.password = pass.input;
  } */
};

const onSetAvatar = (picture: string) => {
  //console.log("pic", picture);

  const reader = new FileReader();
  reader.onloadend = () => {
    if (typeof reader?.result === "string") {
      const picData = reader.result.split(",")[1];
      //user.profile.avatar = `data:image/png;base64,${picData}`;
    }
  };
  //reader.readAsDataURL(picture.files[0]);
};

onMounted(async () => {
  //await getProfile();

  //pass.show = false;
});
</script>
