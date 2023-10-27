import { AsyncAuthStore, ClientResponseError } from 'pocketbase'
import {
  encryptAsync,
  decryptAsync,
  getPasswordKeyAsync,
  type ICosDirectory,
  type ICosKey,
} from '../composables'
import { usePocketBase } from '../pb/pocketBase'

export const useUser = defineStore('useUser', () => {
  const { pb } = usePocketBase()

  const createNewAccountAsync = async (
    username: string,
    email: string,
    password: string
  ) => {
    const res = await pb?.collection('users').create({
      username,
      email,
      password,
      passwordConfirm: password,
    })
  }

  const login = async (username: string, password: string) => {
    if (pb) {
      user.safe.password = password
      await pb?.collection('users').authWithPassword(username, password)
    }
  }

  const logout = () => {
    user.safe.password = null
    pb?.authStore.clear()
  }

  const user: IUser = reactive({
    auth: false,
    name: '',
    safe: {
      priv: null,
      pub: null,
      encPassword: null,
      key: null,
      password: null,
    },

    async encryptAsync(data) {
      if (typeof data === 'string' && user.safe.key)
        return encryptAsync(data, user.safe.key)
    },

    async decryptAsync(data) {
      if (typeof data === 'string' && user.safe.password)
        return await decryptAsync(data, user.safe.password)
    },

    async secretAsync(data) {
      return undefined
    },

    async signAsync(data) {
      return undefined
    },

    async verifyAsync(data) {
      return ''
    },

    async encryptAndSignAsync(data) {
      const encData = await this.encryptAsync(data)
      if (!encData) throw Error('encryption failed')
      return await this.signAsync(encData)
    },

    async decryptAndVerifyAsync(data) {
      const verfified = await this.verifyAsync(data)
      return await this.decryptAsync(verfified)
    },
  })

  const pair = (): IUserSafe => {
    return user.safe
  }

  const isCryptoKey = (key: IUserSafe): key is IUserSafe => {
    return 'pub' in key && 'priv' in key
  }

  const isEncPair = (pair: string): boolean => {
    let parsedPair = null
    try {
      parsedPair = JSON.parse(pair.replace('SEA', ''))
      return (
        's' in parsedPair &&
        'm' in parsedPair &&
        'iv' in parsedPair.m &&
        's' in parsedPair.m &&
        'ct' in parsedPair.m
      )
    } catch (error) {
      console.log('ERROR while parsing pair', error)
      return false
    }
  }

  return {
    createNewAccountAsync,
    isCryptoKey,
    isEncPair,
    logout,
    login,
    user,
  }
})

export interface IUser {
  auth: boolean
  name: string
  safe: IUserSafe
  encryptAsync(data: string | undefined): Promise<string | undefined>
  decryptAsync(data: string): Promise<string | undefined>
  secretAsync(data: string): Promise<string | undefined>
  signAsync(data: string): Promise<string | undefined>
  verifyAsync(data: string): Promise<string>
  encryptAndSignAsync(data: string | undefined): Promise<string | undefined>
  decryptAndVerifyAsync(
    data: string
  ): Promise<string | ICosDirectory | ICosKey | undefined>
  /*   logout(): void
  loginAsync(username: string, password: string): void
  loginWithPasswordAsync(encPair: string, password: string): void
  updateProfileAsync(field: string, value: any): Promise<void>
 */
}

interface IUserSafe {
  password: string | null
  encPassword: string | null
  priv: string | null
  pub: string | null
  key: CryptoKey | null
}

interface ICosPair {
  priv: string
  pub: string
}
