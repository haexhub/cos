import { PersistentStore, Store } from "./main";
//import { VAULT_STORE_NAME } from "./store-names";
import { watch } from "vue"

export interface IKeyVaule {
  [key: string]: any
}

export interface IVaultDB {
  [id: string]: IVaultFile
}

export interface IVaultDirectory {
  name?: string
  readonly id?: string
  keys?: string[]
  subdirectories?: Array<string>
  last_modified?: Date
}

export interface IVaultDirectoryDB {
  [id: string]: IVaultDirectory,
  rootDirectory: IVaultDirectory,
  trash: IVaultDirectory
}

export interface IVaultKey {
  readonly id?: string,
  title?: string
  description?: string
  username?: string
  password?: string
  urls?: Array<IVaultKeyUrl>
  attributes?: Array<IKeyVaule>
  history?: Array<IVaultKey>
  last_modified?: Date
}

export interface IVaultKeyUrl {
  url: string,
  open_command: string,
}

export interface IVaultKeyDB {
  [id: string]: IVaultKey
}

export interface IVaultStore {
  vaults?: IVaultDB,
  markedDirectories: string[],
  markedKeys?: string[],
  currentVaultId: string
}

export interface IVaultFile {
  directories?: IVaultDirectoryDB,
  fileHandle?: FileSystemFileHandle,
  fileName?: string,
  readonly id?: string,
  keys?: IVaultKeyDB,
  password?: string,
}

export interface IVaultReturn {
  status: string,
  message: string
}

//class VaultStore extends PersistentStore<IVaultStore> {
class VaultStore extends Store<IVaultStore> {
  protected data(): IVaultStore {
    return {
      vaults: {},
      markedDirectories: [],
      markedKeys: [],
      currentVaultId: ""
    };
  }

  readonly templateNewDatabase: IVaultFile = {
    id: this.getUUID(),
    directories: {
      "rootDirectory": {
        id: "rootDirectory",
        name: "rootDirectory",
        keys: [],
        subdirectories: [
          "1"
        ],
        last_modified: new Date()
      },
      "trash": {
        id: "trash",
        name: "trash",
        keys: [],
        last_modified: new Date()
      },
      "1": {
        id: "1",
        name: "Internet",
        keys: ["3"],
        subdirectories: ["2"],
        last_modified: new Date()
      },

      "2": {
        id: "2",
        name: "E-Mails",
        keys: ["4"],
        subdirectories: [],
        last_modified: new Date()
      }
    },
    keys: {
      "3": {
        id: "3",
        title: "demo key",
        password: "demo password",
        last_modified: new Date()
      },
      "4": {
        id: "4",
        title: "demo key2",
        password: "demo password2",
        last_modified: new Date()
      }
    },
  }

  addDirectory(directory: IVaultDirectory, parentDirectoryId?: string, vaultId?: string,): boolean {
    try {
      const useVaultId = vaultId || this.state.currentVaultId

      if (!useVaultId || !this.state.vaults?.[useVaultId])
        return false

      const newDirectory = this.createNewDirectory(directory) as IVaultDirectory

      if (!newDirectory)
        return false

      console.log("addDirectory", newDirectory)
      console.log("parentDirectoryId", parentDirectoryId)
      //@ts-ignore
      this.state.vaults[useVaultId].directories[newDirectory.id] = newDirectory

      if (parentDirectoryId && this.state.vaults[useVaultId].directories?.[parentDirectoryId]) {
        this.state.vaults[useVaultId].directories?.[parentDirectoryId].subdirectories?.push(newDirectory.id as string)
      } else {
        this.state.vaults[useVaultId].directories?.["rootDirectory"].subdirectories?.push(newDirectory.id as string)
      }

      return true
    } catch (error) {
      console.log("ERROR vault-store addDirectory ", error)
      return false
    }
  }

  createNewDirectory(directory?: IVaultDirectory): IVaultDirectory | boolean {
    try {
      const newDirectory = { id: this.getUUID() } as IVaultDirectory

      newDirectory.keys = []
      newDirectory.last_modified = new Date()
      newDirectory.name = directory?.name || "NoName"
      newDirectory.subdirectories = []
      return newDirectory
    } catch (error) {
      return false
    }
  }

  deleteDirectory(directoryId: string, vaultId?: string): boolean {
    try {
      const useVaultId = vaultId || this.state.currentVaultId

      if (!useVaultId
        || !directoryId
        || !this.state.vaults?.[useVaultId]
        || !this.state.vaults?.[useVaultId]?.directories?.[directoryId]
        || directoryId === "trash"
        || directoryId === "rootDirectory"
      )
        return false

      this.state.vaults?.[useVaultId]?.directories?.[directoryId].keys?.forEach(keyId => this.deleteKey(keyId))
      this.state.vaults?.[useVaultId]?.directories?.[directoryId].subdirectories?.forEach(subDirectoryId => this.deleteDirectory(subDirectoryId))

      for (const id in this.state.vaults[useVaultId].directories) {
        if (this.state.vaults[useVaultId].directories?.[id].subdirectories?.length)

          //@ts-ignore
          this.state.vaults[useVaultId].directories[id].subdirectories = this.state.vaults[useVaultId].directories?.[id].subdirectories?.filter(subDirectoryId => subDirectoryId !== directoryId)
      }

      delete this.state.vaults[useVaultId].directories?.[directoryId]

      return true
    } catch (error) {
      console.log("ERROR deleteDirectory", error)
      return false
    }
  }

  addKey(key: IVaultKey, directoryId?: string, vaultId?: string,): boolean {
    try {
      const useVaultId = vaultId || this.state.currentVaultId

      if (!useVaultId || !this.state.vaults?.[useVaultId])
        return false


      console.log("vaultId", useVaultId)
      console.log("directoryId", directoryId)

      const newKey = this.createNewKey(key)
      console.log("addKey", key)


      this.state.vaults[useVaultId].keys = Object.assign(this.state.vaults[useVaultId].keys || {}, { [newKey.id || this.getUUID()]: newKey })

      if (directoryId && this.state.vaults[useVaultId].directories?.[directoryId]) {
        this.state.vaults[useVaultId].directories?.[directoryId].keys?.push(newKey.id as string)
      } else {
        this.state.vaults[useVaultId].directories?.["rootDirectory"].keys?.push(newKey.id as string)
      }

      console.log("added key", this.state.vaults)
      return true
    } catch (error) {
      console.log("ERROR addKey", error)
      return false
    }
  }

  createNewKey(key?: IVaultKey): IVaultKey {
    const newKey = { id: key?.id || this.getUUID() } as IVaultKey

    newKey.attributes = key?.attributes || []
    newKey.description = key?.description || ""
    newKey.history = key?.history || []
    newKey.last_modified = key?.last_modified || new Date()
    newKey.password = key?.password || ""
    newKey.title = key?.title || ""
    newKey.urls = key?.urls || []
    newKey.username = key?.username || ""
    return newKey
  }

  async saveKey(key: IVaultKey, vaultId?: string): Promise<boolean> {
    try {
      const useVaultId = vaultId || this.state.currentVaultId

      if (!useVaultId || !key.id || !this.state.vaults?.[useVaultId] || !this.state.vaults[useVaultId]?.keys?.[key.id])
        return false

      const oldKey = this.state.vaults[useVaultId]?.keys?.[key.id] as IVaultKey

      console.log("oldKey is newKey", JSON.stringify(oldKey) === JSON.stringify(key))

      if (JSON.stringify(oldKey) === JSON.stringify(key))
        return true

      oldKey.history = []
      key.history?.push(oldKey)
      key.last_modified = new Date()

      console.log("saveKey", key)

      delete this.state.vaults[useVaultId].keys?.[key.id]

      this.state.vaults[useVaultId].keys = Object.assign(this.state.vaults[useVaultId].keys as IVaultKeyDB, { [key.id]: this.createNewKey(key) })

      console.log("vault updated", this.state.vaults[useVaultId])
      return await this.saveVault(useVaultId)

    } catch (error) {
      console.log("ERROR saveKey", error)
      return false
    }
  }

  moveKeyToTrash(keyId: string, vaultId?: string) {
    console.log("move2trash", keyId)
    const useVaultId = vaultId || this.state.currentVaultId

    if (!useVaultId || !this.state.vaults?.[useVaultId])
      return false

    this.deleteKeyReference(keyId, useVaultId)

    this.state.vaults?.[useVaultId]?.directories?.trash.keys?.push(keyId)
    return true
  }

  deleteKey(keyId: string, vaultId?: string) {
    const useVaultId = vaultId || this.state.currentVaultId

    console.log("deleteKey", keyId)
    console.log("in vault", useVaultId)
    if (!useVaultId || !this.state.vaults?.[useVaultId])
      return false

    if (this.isKeyInTrash(keyId, useVaultId)) {
      this.deleteKeyReference(keyId, useVaultId, true)
      delete this.state.vaults[useVaultId].keys?.[keyId]
      return true
    }
    else
      return this.moveKeyToTrash(keyId, useVaultId)
  }

  deleteKeyReference(keyId: string, vaultId?: string, deleteInTrash: boolean = false) {
    const useVaultId = vaultId || this.state.currentVaultId

    if (!useVaultId || !this.state.vaults?.[useVaultId])
      return false

    for (const id in this.state.vaults[useVaultId].directories) {
      if (id === "trash" && deleteInTrash === false)
        continue

      //@ts-ignore
      this.state.vaults[useVaultId].directories[id].keys = this.state.vaults[useVaultId].directories?.[id].keys?.filter(subKeyId => subKeyId !== keyId)
    }
  }

  isKeyInTrash(keyId: string, vaultId?: string) {
    const useVaultId = vaultId || this.state.currentVaultId

    if (!useVaultId || !this.state.vaults?.[useVaultId])
      return false

    return this.state.vaults[useVaultId].directories?.trash?.keys?.includes(keyId)
  }

  addVaultFile(newVault: IVaultFile, fileHandle: FileSystemFileHandle): boolean {
    if (!newVault.id || !fileHandle)
      return false

    let found = false

    for (const vaultId in this.state.vaults) {
      if (this.state.vaults[vaultId].id === newVault.id) {
        found = true

        console.log("vault already exists ", newVault.id)

        this.state.vaults[vaultId].fileName = newVault.fileName

        this.state.vaults[vaultId].directories = newVault.directories

        this.state.vaults[vaultId].keys = newVault.keys || {}

        this.state.vaults[vaultId].fileHandle = fileHandle

        this.state.vaults[vaultId].password = newVault.password

        watch(() => this.state.vaults, (vaults) => {
          if (vaults && vaults[vaultId] && !vaults?.[vaultId]?.fileHandle) {
            console.log("REMOVE VAULT ", vaultId)
            delete this.state.vaults?.[vaultId]
          }
        })
        return true
      }
    }

    if (found === false) {
      //console.log("add new vault ", newVault.id)
      const newId = newVault.id || this.getUUID()

      this.state.vaults = Object.assign(
        JSON.parse(
          JSON.stringify(
            this.state.vaults
          )),
        {
          [newId]: {
            id: newId,
            fileName: newVault.fileName,
            directories: newVault.directories || {},
            keys: newVault.keys || {},
            fileHandle,
            password: newVault.password
          }
        })
      return true
    }
    return false
  }

  base64ToBuffer(base64: string) {
    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  }

  bufferToBase64(buffer: Uint8Array) {
    return btoa(String.fromCharCode.apply(null, [...buffer]))
  }

  deleteVaults() {
    for (const vaultId in this.state.vaults) {
      if (this.state.vaults[vaultId].fileHandle)
        delete this.state.vaults[vaultId]
    }
  }

  async createNewFileHandle(): Promise<FileSystemFileHandle | false> {
    try {
      //@ts-ignore
      const newVaultFileHandle = await window.showSaveFilePicker({
        suggestedName: "cosVault.cos",
        types: [{
          description: 'COS Vault',
          accept: {
            'application/plain': ['.cos']
          }
        }],
        multiple: false,
        id: 'cos'
      })

      console.log("created newVaultFileHandle", newVaultFileHandle)

      return newVaultFileHandle
    } catch (error) {
      if (error instanceof Error) {
        console.log("error while creating new databse ", error)
      }
      return false
    }
  }

  async encrypt(data: string, password: string): Promise<string | boolean> {
    try {
      console.log("encrypt data", data)
      console.log("password", password)

      const salt = crypto.getRandomValues(new Uint8Array(16))

      const iv = crypto.getRandomValues
        (new Uint8Array(12))

      const key = await this.generateKey(password)

      const aesKey = await this.deriveKey(key, salt, ["encrypt"])

      const encryptedContent = await crypto.subtle.encrypt({
        name: 'AES-GCM',
        iv
      },
        aesKey,
        new TextEncoder().encode(data)
      )

      const encryptedContentArray = new Uint8Array(encryptedContent)

      const buffer = new Uint8Array(
        salt.byteLength + iv.byteLength + encryptedContentArray.byteLength
      )

      buffer.set(salt, 0)
      buffer.set(iv, salt.byteLength)
      buffer.set(encryptedContentArray, salt.byteLength + iv.byteLength)

      const base64 = this.bufferToBase64(buffer)

      console.log("base64", base64)
      return base64
    } catch (error) {
      console.log("ERROR during encryption", error)
      return false
    }
  }

  async decrypt(encyptedData: string, password: string): Promise<string | false> {
    try {
      const encryptedDataBuffer = this.base64ToBuffer(encyptedData)

      const salt = encryptedDataBuffer.slice(0, 16)

      const iv = encryptedDataBuffer.slice(16, 16 + 12)

      const data = encryptedDataBuffer.slice(16 + 12)

      const key = await this.generateKey(password)

      const aesKey = await this.deriveKey(key, salt, ["decrypt"])

      const decryptedContent = await crypto.subtle.decrypt({
        name: "AES-GCM",
        iv
      },
        aesKey,
        data
      )

      //console.log("decryptedContent", decryptedContent)
      const dec = new TextDecoder()
      return dec.decode(decryptedContent)

    } catch (error) {
      console.log("ERROR during decryption", error)
      return false
    }
  }

  async decryptVaultFileHandle(fileHandle: FileSystemFileHandle, password: string): Promise<IVaultFile | false> {
    try {
      if (fileHandle.kind === 'file') {
        //console.log("decrypt", fileHandle.name, password)
        const file = await fileHandle.getFile()

        const encryptedData = await file.text()

        const decryptedData = await this.decrypt(encryptedData, password)

        //console.log("decryptedData", decryptedData)

        if (!decryptedData)
          return false

        const data = JSON.parse(decryptedData) as IVaultFile

        data.fileHandle = fileHandle
        data.password = password
        data.fileName = fileHandle.name

        //console.log("decrypted vault", data)
        if (data)
          return data

      }
      return false
    } catch (error) {
      console.log("ERROR decryptVaultDB ", error)
      return false
    }
  }

  deriveKey(key: CryptoKey, salt: Uint8Array, keyUsage: KeyUsage[]): Promise<CryptoKey> {
    return crypto.subtle.deriveKey({
      name: "PBKDF2",
      salt,
      iterations: 250.000,
      hash: "SHA-256"
    },
      key,
      {
        name: "AES-GCM",
        length: 256
      },
      false,
      keyUsage
    )
  }

  generateKey(rawKey: string) {
    const extractable = false

    return crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(rawKey),
      "PBKDF2",
      extractable,
      ["deriveKey"]
    )
  }

  getDirectory(directoryId: string, vaultId?: string): IVaultDirectory | false {
    const useVaultId = vaultId || this.state.currentVaultId

    if (!useVaultId || !this.state.vaults?.[useVaultId])
      return false

    return this.state.vaults?.[useVaultId].directories?.[directoryId] || false

  }

  getDirectories(directoryIds: string[] = [], vaultId?: string): IVaultDirectory[] | [] {
    try {
      const useVaultId = vaultId || this.state.currentVaultId

      if (!useVaultId || !this.state.vaults?.[useVaultId])
        return []

      let directories = [] as IVaultDirectory[]

      console.log("search directories ", vaultId, directoryIds)

      if (!Array.isArray(directoryIds))
        return []

      directoryIds?.forEach(directoryId => directories.push(this.getDirectory(useVaultId, directoryId) as IVaultDirectory))

      console.log("found dirs ", directories)
      return directories
    } catch (error) {
      console.log("ERROR getDirectories ", error)
      return []
    }
  }

  getKey(keyId: string, vaultId?: string): IVaultKey | boolean {
    const useVaultId = vaultId || this.state.currentVaultId

    if (!useVaultId || !this.state.vaults?.[useVaultId])
      return false

    const vault = this.getVault(useVaultId)

    if (vault)
      return vault.keys?.[keyId] || false

    return false
  }

  getUUID() {
    return crypto.randomUUID()
  }

  getVault(vaultId: string): IVaultFile | false {
    for (const vaultKey in this.state.vaults) {
      if (this.state.vaults[vaultKey].id === vaultId) {
        //console.log("found vault ", this.state.vaults[vaultKey])
        return this.state.vaults[vaultKey]
      }
    }

    return false
  }

  setCurrentVault(vaultId: string) {
    if (this.state.vaults?.[vaultId])
      this.state.currentVaultId = vaultId
  }

  async getVaultFileHandle(): Promise<FileSystemFileHandle | false> {
    try {
      //@ts-ignore
      const [vaultFileHandle] = await window.showOpenFilePicker({
        types: [{
          description: 'COS Vault',
          accept: {
            'application/plain': ['.cos']
          }
        }],
        multiple: false,
        id: 'cos'
      })
      return vaultFileHandle
    } catch (error) {
      console.log(error)
      return false
    }
  }

  markItem({ keyId, directoryId }: { keyId?: string, directoryId?: string }) {
    if (keyId)
      this.state.markedKeys?.push(keyId)
    if (directoryId)
      this.state.markedDirectories.push(directoryId)
  }

  unmarkItem({ keyId, directoryId }: { keyId?: string, directoryId?: string }) {
    if (directoryId)
      this.state.markedDirectories = this.state.markedDirectories?.filter(markedDirectoryId => markedDirectoryId !== directoryId)
    if (keyId)
      this.state.markedKeys = this.state.markedKeys?.filter(markedKeyId => markedKeyId !== keyId)
  }

  clearMarkedItems() {
    this.state.markedDirectories = []
    this.state.markedKeys = []
  }

  deleteMarkedItems() {
    this.state.markedDirectories?.forEach(directoryId => this.deleteDirectory(directoryId))
    this.state.markedKeys?.forEach(keyId => this.deleteKey(keyId))
  }

  async saveVault(vaultId: string): Promise<boolean> {
    try {
      if (!vaultId)
        return false

      const fileHandle = this.state.vaults?.[vaultId].fileHandle
      const password = this.state.vaults?.[vaultId].password || ""
      const data = JSON.stringify(this.state.vaults?.[vaultId])

      //@ts-ignore
      const writeStream = await fileHandle.createWritable()

      const encryptedData = await this.encrypt(data, password)

      await writeStream.write(
        encryptedData
      )

      await writeStream.close()
      return true
    } catch (error) {
      console.log("Error while writing file", error)
      return false
    }
  }

  extractHashParams(hash: string): IKeyVaule {
    const params = {
      vaultId: "",
      directoryId: ""
    }

    const vaultParams = hash
      .replace(/^#/, "")
      .split("&")
      .map((param: string) => param.split("="));

    vaultParams.forEach((param: IKeyVaule) => {
      if (param[0] === "vaultId") params.vaultId = param[1];
      if (param[0] === "directoryId") params.directoryId = param[1];
    });

    return params
  }
}

export const vaultStore = new VaultStore("");