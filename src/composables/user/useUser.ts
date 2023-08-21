import { SEA, useGun } from '../gun/useGun'
import { useColor } from './useColor'
import type { IGunUserInstance, ISEAPair } from 'gun'
import { type ICosDirectory, type ICosKey } from '../composables'

/**
 * @example
 * {
 *  "initiated": true,
 *  "is": {
 *    "pub": "XnpLVDYZWdl1NNgo6BlD6e3-n3Fzi-ZzVrzbIgYCYHo.9-hHUHaWNaAE6tMp800MMzNtDLtjicS53915IrBu4uc",
 *    "epub": "wAvPlMAg4jvUvK4sPpVyF1CAWnRCMu1YpHnoDrVDg-o.l79QDmdPCLEiO0F_WkB3zYLpJt-lANtyhNmHSM4bTes",
 *    "alias": "XnpLVDYZWdl1NNgo6BlD6e3-n3Fzi-ZzVrzbIgYCYHo.9-hHUHaWNaAE6tMp800MMzNtDLtjicS53915IrBu4uc"
 *  },
 *  "name": "Accord",
 *  "pub": "XnpLVDYZWdl1NNgo6BlD6e3-n3Fzi-ZzVrzbIgYCYHo.9-hHUHaWNaAE6tMp800MMzNtDLtjicS53915IrBu4uc",
 *  "color": "#f55c3d",
 *  "pulse": 1642708061615,
 *  "pulser": 12,
 *  "blink": false,
 *  "safe": {
 *    "saved": true,
 *    "password": null,
 *    "enc": "SEA{\"ct\":\"E+6GViU9dTuidruOCNAoBITE+AlGNRgiABplSbL5fh4v1P+fhF33MuBwKd3ssBNi2kJ1sCzvS/YLmzivECA5ARZPGVbgXTSj8AE9kCz0Ac/8ushlsfBNdt8s3+a3OPVxMIevnT01uqcgr75Zp4TugIg/YuB5WltA9RHsgWEMlo+X+tRGaqG5rfw4sAmTSV0P8evMgM9rN/Un5t/WeDbvIPNXqZEmtxwAhMUZwOJWZckNZmNwpxnelFO0BwmauWfzkXuqGeSxNhMeaZi+VoRDMUvTjT68DLBnVoOhFhcdco+RW8AJfktZHZ4GF2IzFnQmTGpUd2LfvIY/Yn1eNJH7iQ5w41ChiYB/zhgQCOc5ur51PV6swAuN595vUNn7+0J1JRSNGzW2V/4j4YR4IEsAoqOtdn2Y21ga/CFdrE0=\",\"iv\":\"LtODTV+LBzhWHqUcptUO\",\"s\":\"XCL9Uj1YlPcV\"}",
 *  "pass": "SEA{\"ct\":\"8wNClMx/ebfou+gGWdf+bbx0TAgc9RU=\",\"iv\":\"NPgHkI+Ke+i/mw+3chlr\",\"s\":\"3VzGv06Y4fQ+\"}"
 *  }
 * }
 */
export interface IUser {
  initiated: boolean
  auth: boolean
  is?: {
    pub?: string
    epub?: string
    alias?: ISEAPair | string
  } | null
  name: string
  pub: string
  color: string
  pulse: number
  pulser: any
  blink: boolean
  safe: IUserSafe
  db?: IGunUserInstance
  pair(): ISEAPair
  encryptAsync(data: unknown): Promise<string>
  decryptAsync(data: string): Promise<string | ICosDirectory | ICosKey>
  secretAsync(data: string): Promise<string | undefined>
  signAsync(data: string): Promise<string>
  verifyAsync(data: string): Promise<string>
  encryptAndSignAsync(data: unknown): Promise<string>
  decryptAndVerifyAsync(data: string): Promise<string | ICosDirectory | ICosKey>
  leave(): void
  login(pair: ISEAPair): void
  loginWithPasswordAsync(encPair: string, password: string): void
  updateProfileAsync(field: string, value: any): Promise<void>
}

interface IUserSafe {
  saved: boolean
  password: string
  enc: string
  pass: string
  rooms: object
}

/**
 * Get access to current logged in user
 * @example
 * import { useUser } from '@gun-vue/composables'
 *
 * const { user, auth, leave } = useUser()
 */

export const useUser = defineStore('useUser', () => {
  const { gun } = useGun()
  const colorDeep = useColor('deep')
  let pairReads = 0

  const login = (pair: ISEAPair, cb = (pair: ISEAPair) => {}) => {
    if (!isPair(pair)) {
      console.log('incorrect pair', pair)
      return
    }

    gun.user().auth(pair, async () => {
      cb(pair)
    })
  }

  const loginWithPasswordAsync = async (encPair: string, password: string) => {
    const pair = await SEA.decrypt(encPair, password)
    login(pair)
  }

  const leave = () => {
    let is = !!user.is?.pub

    clearInterval(user.pulser)
    gun.user().leave()
    setTimeout(() => {
      if (is && !pair()) {
        user.is = null
        user.auth = false
        user.initiated = false
        console.info('User logged out')
      }
    }, 500)
  }

  const updateProfileAsync = async (field: string, data: any) => {
    if (field && data !== undefined) {
      gun
        .user()
        .get('profile')
        .get(field)
        .put(await user.encryptAndSignAsync(data))
    }
  }

  const user: IUser = reactive({
    initiated: false,
    auth: false,
    is: null,
    name: '',
    pub: computed(() => user?.is?.pub) as unknown as string,
    color: computed(() =>
      user.pub ? colorDeep.hex(user.pub) : 'gray'
    ) as unknown as string,
    pulse: 0,
    pulser: null,
    blink: false,
    safe: {
      saved: false,
      password: '',
      enc: '',
      pass: '',
      rooms: {},
    },
    db: undefined,
    pair() {
      console.warn('User pair read externally')
      return pair()
    },

    async encryptAsync(data) {
      return await SEA.encrypt(data, pair())
    },

    async decryptAsync(data) {
      return await SEA.decrypt(data, pair())
    },

    async secretAsync(data) {
      return await SEA.secret(data, pair())
    },

    async signAsync(data) {
      return await SEA.sign(data, pair())
    },

    async verifyAsync(data) {
      return await SEA.verify(data, pair())
    },

    async encryptAndSignAsync(data) {
      const encData = await this.encryptAsync(data)
      return await this.signAsync(encData)
    },

    async decryptAndVerifyAsync(data) {
      const verfified = await this.verifyAsync(data)
      return await this.decryptAsync(verfified)
    },

    leave,
    login,
    loginWithPasswordAsync,
    updateProfileAsync,
  })

  if (!user.initiated) {
    user.db = gun.user()

    console.log('user.db', user.db)
    gun.user().recall({ sessionStorage: true }, () => {
      console.log('user was recalled')
    })

    gun.on('auth', () => {
      init()
      console.log('user authenticated')
      user.auth = true
    })
  }

  const init = () => {
    user.is = gun.user().is

    if (user.is === null || user.is === undefined) return

    if (user.pulser) {
      clearInterval(user.pulser)
    }
    user.pulser = setInterval(() => {
      gun.user().get('pulse').put(Date.now())
    }, 1000)

    gun.user().get('epub').put(user.is.epub)

    gun
      .user()
      .get('pulse')
      .on((d) => {
        user.blink = !user.blink
        user.pulse = d
      })

    gun
      .user()
      .get('safe')
      .map()
      .on((d, k: string) => {
        //@ts-ignore
        user.safe[k] = d
      })

    gun
      .user()
      .get('profile')
      .map()
      .on((d, k: string) => {
        //@ts-ignore
        user.safe[k] = d
      })

    user.initiated = true
  }

  const pair = (): ISEAPair => {
    console.log('User pair read', ++pairReads)
    //@ts-ignore
    return gun.user()?._?.sea
  }

  const createPairAsync = async () => {
    return await SEA.pair()
  }

  const isMine = (soul: string) => {
    if (!soul) return
    return soul.slice(1, 88) == user.pub
  }

  const isPair = (pair: ISEAPair): boolean => {
    return Boolean(
      pair &&
        typeof pair == 'object' &&
        pair.pub &&
        pair.epub &&
        pair.priv &&
        pair.epriv
    )
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
    createPairAsync,
    isMine,
    isPair,
    isEncPair,
    leave,
    login,
    loginWithPasswordAsync,
    updateProfileAsync,
    user,
  }
})
