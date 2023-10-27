import PocketBase from 'pocketbase'

const serverAddress = 'http://127.0.0.1:8080'

export const usePocketBase = defineStore('pocketbase', () => {
  const pb: Ref<PocketBase | null> = ref(null)

  const connectToServer = (serverAddress: string) => {
    console.log('connect to pb server')
    pb.value = new PocketBase(serverAddress)
    console.log('connected', pb.value)
  }

  if (!pb.value) {
    connectToServer(serverAddress)
  }

  return {
    connectToServer,
    pb,
  }
})
