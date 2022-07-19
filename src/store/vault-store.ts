import { PersistentStore } from "./main";
import { VAULT_STORE_NAME } from "./store-names";
import { v4 as uuidv4 } from 'uuid';
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
  last_modified: Date
}

export interface IVaultKeyDB {
  [id: string]: IVaultKey
}

export interface IVaultStore {
  vaults?: IVault,
  currentKeys: string[],
}

export interface IVaultFile {
  id: string,
  fileName?: string,
  directories?: IVaultDirectoryDB,
  rootDirectories?: string[],
  keys?: IVaultKeyDB,
  fileHandle?: FileSystemFileHandle
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

  protected readonly templateNewDatabase: IVaultFile = {
    id: uuidv4(),
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
      const newId = newVault.id || uuidv4()

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

            fileHandle
          }
        })
    }
  }

  clearVaults() {
    console.log("clear vaults")
    this.state.vaults = {}
  }

  async createNewDatabase(): Promise<string> {
    try {
      const newFileContent = {
        name: "",
        content: this.templateNewDatabase
      }

      //@ts-ignore
      const newVaultFileHandle = await window.showSaveFilePicker({
        suggestedName: "cosVault.json",
        types: [{
          description: 'COS Vault',
          accept: {
            'application/json': ['.json']
          }
        }],
        multiple: false,
        id: 'cos'
      })

      console.log("created new database ", newVaultFileHandle)

      const writeStream = await newVaultFileHandle.createWritable()

      await writeStream.write(
        JSON.stringify(this.templateNewDatabase)
      )

      await writeStream.close()

      const newVaultFile = await this.readCosFileHandle(newVaultFileHandle)

      this.addVaultFile(newVaultFile, newVaultFileHandle)

      return newVaultFile.id
      /* const zip = new JSZip()
      const rootFolder = zip.folder("demo")?.file("vault.json", JSON.stringify(this.templateNewDatabase))
      console.log("zip ", rootFolder)

      await writeStream.write(
        await rootFolder?.generateAsync({ type: "uint8array" })
      ) */

      //await writeStream.close()

      /*  const f = await rootFolder?.generateAsync({ type: "blob" })
         .then(function (blob) { saveAs(blob, "demo.zip") }) */

    } catch (error) {
      if (error instanceof Error) {
        console.log("error while creating new databse ", error)
      }
      return ""
    }
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

  readFile(file: Blob) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      console.log("read file ", file)
      fileReader.onload = x => resolve(fileReader.result)
      fileReader.readAsText(file)
    })
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