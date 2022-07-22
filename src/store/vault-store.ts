import { PersistentStore } from "./main";
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
}

export interface IVaultDirectoryDB {
  [id: string]: IVaultDirectory
}

export interface IVaultKey {
  id: string,
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
  currentKeys: string[],
}

export interface IVaultFile {
  directories?: IVaultDirectoryDB,
  fileHandle?: FileSystemFileHandle,
  fileName?: string,
  id: string,
  keys?: IVaultKeyDB,
  password?: string,
  rootDirectories?: string[],
}

export interface IVaultReturn {
  status: string,
  message: string
}

class VaultStore extends PersistentStore<IVaultStore> {
  protected data(): IVaultStore {
    return {
      vaults: {},
      currentKeys: [],
    };
  }

  readonly templateNewDatabase: IVaultFile = {
    id: crypto.randomUUID(),
    directories: {
      "rootDirectory": {
        id: "rootDirectory",
        name: "Internet",
        keys: [],
        subdirectories: [
          "1"
        ]
      },
      "1": {
        id: "1",
        name: "Internet",
        keys: ["3"],
        subdirectories: ["2"],
      },

      "2": {
        id: "2",
        name: "E-Mails",
        keys: ["4"],
        subdirectories: []
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

  async addDirectory(directory: IVaultDirectory, directoryId: string,) {
    // Füge Directory hinzu und setze Verweis in das Subdirectory im Parent 

    try {
      console.log("add directory ", directory, " parent ", directoryId)

      console.log("current directories ", JSON.stringify(this.state.vaults?.[0].directories))

      /* this.state.directories = Object.assign(this.state.directories, { [directory.id]: directory })

      console.log("after merge directories ", this.state.directories?.["245"])

      this.state.directories[directoryId].subDirectories = [...this.state.directories[directoryId].subDirectories, directory.id]
 */

      //Object.assign([], ...this.state.directories[directoryId].subDirectories, directory.id)


      //this.state.vault[0] = directory
    } catch (error) {
      console.log("ERROR vault-store addDirectory ", error)
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

        this.state.vaults[vaultId].rootDirectories = newVault.rootDirectories || []

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

            rootDirectories: newVault.rootDirectories || [],

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

  clearVaults() {
    console.log("clear vaults")
    this.state.vaults = {}
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

    console.log("search directory ", vaultId, directoryId, this.state.vaults)

    if (this.state.vaults?.[vaultId]) {
      console.log("found directory ", this.state.vaults?.[vaultId].directories?.[directoryId])
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

  getKey(vaultId: string, keyId: string) {
    const vault = this.getVault(vaultId) as IVaultFile

    return vault.keys?.[keyId] || {}
  }

  getVault(id: string): IVaultFile | {} {
    console.log("search vault ", id, this.state, this.state.currentKeys)
    let vault = {}
    for (const vaultKey in this.state.vaults) {
      if (this.state.vaults[vaultKey].id === id) {
        console.log("found vault ", this.state.vaults[vaultKey])
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

  async openVaultDB(): Promise<string> {
    try {
      //@ts-ignore
      const [vaultFileHandle] = await window.showOpenFilePicker({
        types: [{
          description: 'json',
          accept: {
            'application/json': ['.json']
          }
        }],
        multiple: false,
        id: 'cos'
      })

      console.log("filehandler ", vaultFileHandle)

      const vaultFile = await this.readCosFileHandle(vaultFileHandle)

      this.addVaultFile(vaultFile, vaultFileHandle)

      console.log("new vaults ", this.state.vaults)
      return vaultFile.id

    } catch (error) {
      if (error instanceof Error) {
        console.log("ERROR open Database ", error)
      }
      return ""
    }
  }

  async readCosFileHandle(fileHandle: FileSystemFileHandle): Promise<IVaultFile> {
    try {
      if (fileHandle.kind === 'file') {

        const vaultFile = await fileHandle.getFile()

        const content = JSON.parse(
          await vaultFile.text()
        ) as IVaultFile

        const vault = {
          id: content.id,
          fileName: vaultFile.name,
          rootDirectories: content.rootDirectories,
          directories: content.directories,
          keys: content.keys
        }

        console.log("vault ", vault)
        return vault
      }
      throw new Error()
    } catch (error) {
      console.log("ERROR readCosFileHandle ", error)
      throw new Error()
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

  async saveKey(vaultId: string, key: IVaultKey): Promise<boolean> {
    try {

      if (!this.state.vaults?.[vaultId]) {
        return false
      }

      console.log("vault", this.state.vaults[vaultId])

      if (!this.state.vaults?.[vaultId]
        && !this.state.vaults[vaultId]?.keys?.[key.id]) {
        return false
      }

      //@ts-ignore
      this.state.vaults[vaultId].keys[key.id] = key

      console.log("vault updated", this.state.vaults[vaultId])

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

      return false
    } catch (error) {
      console.log("ERROR saveKey", error)
      return false
    }
  }

  setSelectedDirectory(vaultId: string, directoryId: string) {
    for (const vaultKey in this.state.vaults) {
      if (this.state.vaults[vaultKey].id === vaultId) {
        this.state.currentKeys = this.state.vaults[vaultKey].directories?.[vaultId]?.keys || []
      }
    }
  }
}

export const vaultStore = new VaultStore(VAULT_STORE_NAME);