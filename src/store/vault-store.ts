import { PersistentStore, Store } from "./main";
import { VAULT_STORE_NAME } from "./store-names";
import { watch } from "vue"

export interface IKeyVaule {
  [key: string]: any
}

export interface IVault {
  [id: string]: IVaultFile
}

export interface IVaultDirectory {
  name?: string
  id?: string
  keys?: string[]
  subdirectories?: Array<string>
  last_modified?: Date
}

export interface IVaultDirectoryDB {
  [id: string]: IVaultDirectory
}

export interface IVaultKey {
  id?: string,
  title?: string
  description?: string
  username?: string
  password?: string
  urls?: Array<string>
  attributes?: Array<IKeyVaule>
  history?: Array<IVaultKey>
  last_modified?: Date
}

export interface IVaultKeyDB {
  [id: string]: IVaultKey
}

export interface IVaultStore {
  vaults?: IVault,
}

export interface IVaultFile {
  directories?: IVaultDirectoryDB,
  fileHandle?: FileSystemFileHandle,
  fileName?: string,
  id?: string,
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
    };
  }

  readonly templateNewDatabase: IVaultFile = {
    id: crypto.randomUUID(),
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

  async addDirectory(directory: IVaultDirectory, vaultId: string, parentDirectoryId: string): Promise<boolean> {
    try {
      console.log("add directory ", directory, " parent ", parentDirectoryId)

      if (!vaultId || !this.state.vaults?.[vaultId])
        return false

      const newDirectory = {} as IVaultDirectory

      newDirectory.id = crypto.randomUUID()
      newDirectory.keys = []
      newDirectory.last_modified = new Date()
      newDirectory.name = directory.name || "NoName"
      newDirectory.subdirectories = []

      //@ts-ignore
      this.state.vaults[vaultId].directories[newDirectory.id] = newDirectory

      if (parentDirectoryId && this.state.vaults[vaultId].directories?.[parentDirectoryId]) {
        this.state.vaults[vaultId].directories?.[parentDirectoryId].subdirectories?.push(newDirectory.id)
      } else {
        this.state.vaults[vaultId].directories?.["rootDirectory"].subdirectories?.push(newDirectory.id)
      }

      return true
    } catch (error) {
      console.log("ERROR vault-store addDirectory ", error)
      return false
    }
  }

  async addKey(key: IVaultKey, vaultId: string, directoryId: string): Promise<boolean> {
    try {
      if (!vaultId || !this.state.vaults?.[vaultId])
        return false

      console.log("addKey", key)
      console.log("vaultId", vaultId)
      console.log("directoryId", directoryId)

      const newKey = {} as IVaultKey

      newKey.id = crypto.randomUUID()
      newKey.attributes = key.attributes || []
      newKey.description = key.description || ""
      newKey.history = []
      newKey.last_modified = new Date()
      newKey.password = key.password || ""
      newKey.title = key.title || ""
      newKey.urls = key.urls || []
      newKey.username = key.username || ""

      //@ts-ignore
      this.state.vaults[vaultId].keys[newKey.id] = newKey

      if (directoryId && this.state.vaults[vaultId].directories?.[directoryId]) {
        this.state.vaults[vaultId].directories?.[directoryId].keys?.push(newKey.id)
      } else {
        this.state.vaults[vaultId].directories?.["rootDirectory"].keys?.push(newKey.id)
      }

      console.log("added key", this.state.vaults)
      return true
    } catch (error) {
      console.log("ERROR addKey", error)
      return false
    }
  }

  addVaultFile(newVault: IVaultFile, fileHandle: FileSystemFileHandle) {
    let found = false

    for (const vaultId in this.state.vaults) {
      if (this.state.vaults[vaultId].id === newVault.id) {
        found = true

        console.log("vault already exists ", newVault.id)

        this.state.vaults[vaultId].fileName = newVault.fileName

        this.state.vaults[vaultId].directories = newVault.directories || {}

        this.state.vaults[vaultId].keys = newVault.keys || {}

        this.state.vaults[vaultId].fileHandle = fileHandle

        this.state.vaults[vaultId].password = newVault.password

        watch(() => this.state.vaults, (vaults) => {
          if (vaults && vaults[vaultId] && !vaults?.[vaultId]?.fileHandle) {
            console.log("REMOVE VAULT ", vaultId)
            delete this.state.vaults?.[vaultId]
          }
        })
      }
    }

    if (found === false) {
      console.log("add new vault ", newVault.id)
      const newId = newVault.id || crypto.randomUUID()

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
    }
  }

  base64ToBuffer(base64: string) {
    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  }

  bufferToBase64(buffer: Uint8Array) {
    return btoa(String.fromCharCode.apply(null, [...buffer]))
  }

  cleanupVaults() {
    for (const vaultId in this.state.vaults) {
      if (this.state.vaults[vaultId].fileHandle)
        delete this.state.vaults[vaultId]
    }
  }

  async createNewFileHandle(): Promise<FileSystemFileHandle | false> {
    try {
      const newFileContent = {
        name: "",
        content: this.templateNewDatabase
      }

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

      console.log("created new database ", newVaultFileHandle)

      return newVaultFileHandle
    } catch (error) {
      if (error instanceof Error) {
        console.log("error while creating new databse ", error)
      }
      return false
    }
  }

  async encrypt(data: string, password: string) {
    try {
      console.log("encrypt", data, password)


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
    }
  }

  async decrypt(encyptedData: string, password: string) {
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

      console.log("decryptedContent", decryptedContent)
      const dec = new TextDecoder()
      const s = dec.decode(decryptedContent)

      console.log("decrypted", Object.values(s))
      return s

    } catch (error) {
      console.log("ERROR during decryption", error)
    }
  }

  async decryptVaultFileHandle(fileHandle: FileSystemFileHandle, password: string): Promise<IVaultFile | false> {
    try {
      if (fileHandle.kind === 'file') {
        const file = await fileHandle.getFile()

        const encryptedData = await file.text()

        console.log("encryptedData", encryptedData)
        const decryptedData = await this.decrypt(encryptedData, password)

        console.log("decryptedData", decryptedData)

        if (!decryptedData)
          return false

        const data = JSON.parse(decryptedData) as IVaultFile

        data.fileHandle = fileHandle
        data.password = password
        data.fileName = fileHandle.name

        console.log("decrypted vault", data)
        if (data)
          return data

      }
      return false
    } catch (error) {
      console.log("ERROR decryptVaultDB ", error)
      return false
    }
  }

  deriveKey(key: CryptoKey, salt: Uint8Array, keyUsage: KeyUsage[]) {
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

  getDirectory(vaultId: string, directoryId: string): IVaultDirectory | {} {

    //console.log("search directory ", vaultId, directoryId, this.state.vaults)

    if (this.state.vaults?.[vaultId]) {
      //console.log("found directory ", this.state.vaults?.[vaultId].directories?.[directoryId])
      return this.state.vaults?.[vaultId].directories?.[directoryId] || {}
    }

    return {}

  }

  getDirectories(vaultId: string, directoryIds: string[] = []): IVaultDirectory[] | [] {
    try {
      let directories = [] as IVaultDirectory[]

      console.log("search directories ", vaultId, directoryIds)

      if (!Array.isArray(directoryIds))
        return []

      directoryIds?.forEach(directoryId => directories.push(this.getDirectory(vaultId, directoryId) as IVaultDirectory))

      console.log("found dirs ", directories)
      return directories
    } catch (error) {
      console.log("ERROR getDirectories ", error)
      return []
    }
  }

  getKey(vaultId: string, keyId: string): IVaultKey {
    const vault = this.getVault(vaultId) as IVaultFile

    return vault.keys?.[keyId] || {}
  }

  getVault(id: string): IVaultFile | {} {
    let vault = {}
    for (const vaultKey in this.state.vaults) {
      if (this.state.vaults[vaultKey].id === id) {
        //console.log("found vault ", this.state.vaults[vaultKey])
        vault = this.state.vaults[vaultKey]
        break
      }
    }

    return vault
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

  async saveFileEncrypted(fileHandle: FileSystemFileHandle, data: string, password: string) {
    try {
      //@ts-ignore
      const writeStream = await fileHandle.createWritable()

      const encryptedData = await this.encrypt(data, password)

      console.log("encryptedData", encryptedData)

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

  async saveVault(vaultId: string) {
    try {
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

  async saveKey(vaultId: string, key: IVaultKey): Promise<boolean> {
    try {

      if (!this.state.vaults?.[vaultId] || !key.id) {
        return false
      }

      if (!this.state.vaults?.[vaultId] && key.id
        && !this.state.vaults[vaultId]?.keys?.[key.id]) {
        return false
      }

      console.log("saveKey", key)
      //@ts-ignore
      this.state.vaults[vaultId].keys[key.id] = key

      console.log("vault updated", this.state.vaults[vaultId])
      return await this.saveVault(vaultId)
      /* 
            const fileHandle = this.state.vaults[vaultId]?.fileHandle
            const password = this.state.vaults[vaultId]?.password
      
      
            console.log("filehandle & password", fileHandle, password)
      
            if (fileHandle && password) {
              return await this.saveFileEncrypted(
                fileHandle,
                JSON.stringify(this.state.vaults?.[vaultId]),
                password
              )
            }
      
            return false */
    } catch (error) {
      console.log("ERROR saveKey", error)
      return false
    }
  }
}

export const vaultStore = new VaultStore(VAULT_STORE_NAME);