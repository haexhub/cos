import { saveIndexDb, useUser } from '@/composables/composables'

export const useChamber = defineStore('useChamber', () => {
  const rootDirectoryId = 'root'
  const trashDirectoryId = 'trash'
  const cosDirectoryId = 'cosDirectory'
  const cosKeyId = 'cosKey'

  const { user } = useUser()

  const chamber: IChamber = reactive({
    directories: {},
    initiated: false,
    file: null,
    keys: {},
    rootDirectoryId,
    trashDirectoryId,
    getDirectory: computed(() => (id: string) => chamber.directories?.[id]),
    getKey: computed(() => (id: string) => chamber.keys?.[id]),
  })

  const init = () => {
    if (!chamber.initiated && user.auth) {
      chamber.initiated = true
    }
  }

  init()

  const addKeyAsync = async (key: ICosKey) => {
    console.log('addKey', key)

    if (!isKey(key)) {
      throw new TypeError('Invalid key ' + JSON.stringify(key))
    }

    if (key.directoryId === null || key.directoryId.trim() === '') {
      key.directoryId = rootDirectoryId
    }

    if (key.id === null || key.id.trim() === '') {
      key.id = crypto.randomUUID()
    }

    const directory = chamber.getDirectory(key.directoryId)

    if (directory === null) {
      throw new Error(`Directory with ID ${key.directoryId} not found`)
    }

    const encKey = await user.encryptAsync(JSON.stringify(key))

    if (!encKey) throw new Error('encryption failed')

    const signedEncKey = await user.signAsync(encKey)

    gun.user().get(cosKeyId).get(key.id).put(signedEncKey)

    if (!directory.keys.includes(key.id)) {
      directory.keys.push(key.id)
      await updateDirectoryAsync(directory)
    }
  }

  const deleteKeyAsync = async (keyId: string) => {
    const key = chamber.getKey(keyId)

    if (key === null) {
      throw new Error(`Key with ID ${keyId} not found`)
    }

    const directory = chamber.getDirectory(key.id)

    const indexOfKey = directory?.keys?.indexOf(keyId)

    if (indexOfKey && directory && indexOfKey > -1) {
      directory?.keys.splice(indexOfKey, 1)
      await updateDirectoryAsync(directory)
    }

    if (directory?.id === trashDirectoryId) {
      gun.user().get(cosKeyId).get(keyId).put(null)
    } else {
      key.directoryId = trashDirectoryId
      const trashDirectory = chamber.getDirectory(trashDirectoryId)
      trashDirectory?.keys.push(key.id)
      await updateKeyAsync(key)

      if (trashDirectory) await updateDirectoryAsync(trashDirectory)
    }
  }

  const updateKeyAsync = async (key: ICosKey) => {
    console.log('update key', key)

    if (!isKey(key)) {
      throw new Error('Key ' + JSON.stringify(key) + ' is not a valid key')
    }

    const oldKey = chamber.getKey(key.id)

    if (!oldKey) {
      return await addKeyAsync(key)
    }

    const newKey = {
      description: await user.encryptAndSignAsync(key.description),
      directoryId: key.directoryId,
      icon: key.icon,
      id: key.id,
      password: key.password,
      properties: key.properties,
      title: key.title,
      url: key.url,
      username: await user.encryptAndSignAsync(key.username),
    } as ICosKey

    const encKey = await user.encryptAsync(newKey)
    const signedEncKey = await user.signAsync(encKey)
  }

  const deleteAllKeys = async () => {}

  const addDirectoryAsync = async (directory: ICosDirectory) => {
    if (!isDirectory(directory)) {
      throw new Error('No valid directory ' + JSON.stringify(directory))
    }

    if (
      directory.parentDirectoryId === null ||
      (directory.parentDirectoryId.trim() === '' &&
        directory.id !== rootDirectoryId)
    ) {
      directory.parentDirectoryId = rootDirectoryId
    }

    if (directory.id === null || directory.id.trim() === '') {
      directory.id = crypto.randomUUID()
    }

    const parentDirectory = chamber.getDirectory(directory.parentDirectoryId)

    console.log('parentDirectory', parentDirectory)

    if (parentDirectory === null) {
      throw new Error(
        `ParentDirectory with ID ${directory.parentDirectoryId} not found`
      )
    }

    if (!parentDirectory?.directories.includes(directory.id)) {
      parentDirectory?.directories.push(directory.id)
      await updateDirectoryAsync(parentDirectory)
    }

    await updateDirectoryAsync(directory)
  }

  const updateDirectoryAsync = async (directory: ICosDirectory) => {
    console.log('updateDirectoryAsync', directory)

    if (!isDirectory(directory)) {
      throw new Error(
        'Directory ' + JSON.stringify(directory) + ' is not a valid directory'
      )
    }

    const newDirectory = {
      directories: directory?.directories ?? [],
      icon: directory?.icon ?? '',
      id: directory.id,
      keys: directory?.keys ?? [],
      name: directory.name,
    } as ICosDirectory

    const encDirectory = await user.encryptAsync(newDirectory)
    const signedEncKey = await user.signAsync(encDirectory)
  }

  const deleteDirectoryAsync = async (directoryId: string) => {
    const directory = chamber.getDirectory(directoryId)

    if (directory?.id === trashDirectoryId) {
      directory?.keys?.forEach(async (keyId) => await deleteKeyAsync(keyId))
    }

    if (directoryId === rootDirectoryId || directoryId === trashDirectoryId)
      return
    gun.user().get(cosDirectoryId).get(directoryId).put(null)
  }

  const deleteAllDirectories = async () => {
    gun
      .user()
      .get(cosDirectoryId)
      .map()
      .once(async (encDirectory: string, key: string) => {
        if (key === rootDirectoryId) return
        gun.user().get(cosDirectoryId).get(key).put(null)
      })
  }

  const createChamberFileAsync = async () => {
    const dataType = ref('Text') as Ref<'Text' | 'ArrayBuffer' | 'Blob'>
    const { isSupported, data, create, save } = useFileSystemAccess({
      dataType,
      types: [
        {
          description: 'Chamber',
          accept: {
            'application/cos': ['.cos'],
          },
        },
      ],
      excludeAcceptAllOption: true,
    })

    //if (!isSupported) throw new Error('FileSystemApi not supported')

    await create({
      suggestedName: 'Chamber.cos',
    })

    const payload = {
      pair: user.pair(),
      indexDb: await saveIndexDb(),
    }

    console.log('payload', payload)
    data.value = JSON.stringify(payload)
    await save()
  }

  return {
    addDirectoryAsync,
    addKeyAsync,
    chamber,
    createChamberFileAsync,
    deleteAllDirectories,
    deleteAllKeys,
    deleteDirectoryAsync,
    deleteKeyAsync,
    isDirectory,
    isKey,
    rootDirectoryId,
    trashDirectoryId,
    updateDirectoryAsync,
    updateKeyAsync,
  }
})

export const isKey = (key: ICosKey) => {
  return (
    'description' in key &&
    'id' in key &&
    'password' in key &&
    'title' in key &&
    'url' in key &&
    'username' in key
  )
}

export const isDirectory = (
  directory: ICosDirectory
): directory is ICosDirectory => {
  return (
    'directories' in directory &&
    'icon' in directory &&
    'id' in directory &&
    'keys' in directory &&
    'name' in directory
  )
}

/* export const isHash = (str: string) => {
  return typeof str == "string" && str.length == 44 && str.charAt(43) == "=";
};
 */
/* export const isExpandedDirectory = (directoryId: string) => {
  return cosKey.expandedDirectory.has(directoryId);
};

export const toogleExpandedDirectory = (key: string) => {
  if (cosKey.expandedDirectory.has(key)) {
    cosKey.expandedDirectory.delete(key);
  } else {
    cosKey.expandedDirectory.add(key);
  }
}; */

export interface ICosDirectory {
  id: string
  name: string
  icon?: string
  directories: string[]
  keys: string[]
  parentDirectoryId: string | null
}

export interface ICosKeyProperty {
  key: string | number
  value: string | number
}

export interface ICosKey {
  description: string
  directoryId: string
  icon: string
  id: string
  password: string
  properties: ICosKeyProperty[]
  title: string
  url: string
  username: string
}

export interface IPrimeNode {
  root: IPrimeNodeItem[]
}

export interface IPrimeNodeItem {
  key: string
  label: string
  data?: string
  icon?: string
  children?: IPrimeNodeItem[]
}

export interface IChamber {
  initiated: boolean
  rootDirectoryId: string
  file: File | null
  trashDirectoryId: string
  directories: {
    [key: string]: ICosDirectory
  }
  keys: {
    [key: string]: ICosKey
  }
  getDirectory: (id: string) => ICosDirectory | null
  getKey: (id: string) => ICosKey | null
}

export interface ICosDirectoryBreadcrumbs {
  label: string
  id: string
}
