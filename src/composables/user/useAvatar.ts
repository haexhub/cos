import { useUser, useGun } from '../composables'
import { ref, watch, toRef } from 'vue'
import { type MaybeRefOrGetter } from '@vueuse/core'

export const useAvatar = (
  pubKey: MaybeRefOrGetter<string>,
  picSize: MaybeRefOrGetter<number> = 42
) => {
  const pub = toRef(pubKey)
  const size = toRef(picSize)

  const avatar = ref()
  const blink = ref()

  const { gun } = useGun()

  gun
    .user(pub.value)
    .get('avatar')
    .on((hash) => {
      if (hash) {
        gun
          .get('#avatars')
          .get(hash)
          .once((d) => {
            avatar.value = d
          })
      }
    })

  gun
    .user(pub.value)
    .get('pulse')
    .on(() => {
      blink.value = !blink.value
    })

  return {
    avatar,
    blink,
  }
}

export function useUserAvatar() {
  const { user } = useUser()
  const { gun } = useGun()

  const avatar = ref(null)

  user.db?.get('avatar').on((hash) => {
    if (hash) {
      gun
        .get('#avatars')
        .get(hash)
        .once((d) => {
          avatar.value = d
        })
    } else {
      avatar.value = null
    }
  })

  async function upload(file: string) {
    if (file) {
      /* const hash = await hashText(file);
      if (hash !== undefined) gun.get("#avatars").get(hash).put(file);
      user.db?.get("avatar").put(hash); */
    } else {
      remove()
    }
  }

  function remove() {
    user.db?.get('avatar').put(null)
  }

  return {
    remove,
    upload,
    avatar,
  }
}
