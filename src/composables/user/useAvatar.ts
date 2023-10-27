import { useUser } from '../composables'
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

  return {
    avatar,
    blink,
  }
}

export function useUserAvatar() {
  const { user } = useUser()

  const avatar = ref(null)

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
