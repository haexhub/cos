import { PersistentStore } from "./main";
import { VAULT_STORE_NAME } from "./store-names";
import { v4 as uuidv4 } from 'uuid';


export interface IKeyVaule extends Object {
  [key: string]: any
}

export interface IVaultDirectory extends Object {
  name: string
  id: string
  keys?: string[]
  subdirectories?: Array<string>
}

export interface IVaultDirectoryDB extends Object {
  [id: string]: object
}

export interface IVaultKey extends Object {
  id: string,
  title: string
  description: string
  username: string
  password: string
  urls: Array<string>
  attributes: Array<IKeyVaule>
}

export interface IVaultKeyDB extends Object {
  [id: string]: object
}

export interface IVaultStore extends Object {
  vaults?: Array<IVaultFile>,
  currentKeys: Array<IVaultKey>,
}

export interface IVaultFile extends Object {
  fileHandler: FileSystemHandle,
  fileName?: string,
  fileReader?: FileReader,
  fileContent?: IVaultDirectory
}

class VaultStore extends PersistentStore<IVaultStore> {
  protected data(): IVaultStore {
    return {
      vaults: [],
      currentKeys: [],
    };
  }

  protected readonly templateNewDatabase = {
    directories: {
      "1": {
        id: "1",
        name: "Internet",
        keys: [],
        subdirectories: []
      },

      "2": {
        id: "2",
        name: "E-Mails",
        keys: [],
        subdirectories: []
      }
    },
    keys: [],
    rootDirectories: []
  }

  async addDirectory(directory: IVaultDirectory, directoryId: string,) {
    // Füge Directory hinzu und setze Verweis in das Subdirectory im Parent 

    try {
      console.log("add directory ", directory, " parent ", directoryId)

      console.log("current directories ", JSON.stringify(this.state.directories))

      this.state.directories = Object.assign(this.state.directories, { [directory.id]: directory })

      console.log("after merge directories ", this.state.directories?.["245"])

      this.state.directories[directoryId].subDirectories = [...this.state.directories[directoryId].subDirectories, directory.id]


      //Object.assign([], ...this.state.directories[directoryId].subDirectories, directory.id)

      console.log("addDirectory ", this.state.directories)
      //this.state.vault[0] = directory
    } catch (error) {
      console.log("ERROR vault-store addDirectory ", error)
    }
  }

  close() {
    this.state.directories = {}
    this.state.rootDirectories = []
    this.state.keys = {}
  }

  async createNewDatabase() {
    try {
      const newFileContent = {
        name: "",
        content: this.templateNewDatabase
      }

      const newVaultFileHandle = await window.showSaveFilePicker({
        suggestedName: "cosVault.json",
        types: [{
          description: 'json',
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
    } catch (error) {
      console.log("error while creating new databse ", error)
    }
  }

  getDirectory(id: string): IVaultDirectory | null {
    //console.log("vault-store | directories ", this.state.directories)
    console.log("vault-store | getDirectory id ", id)
    if (this.state.directories?.[id])
      return this.state.directories?.[id] as IVaultDirectory
    else
      return null
  }

  async openVaultDB() {
    try {
      const vaultFileHandler = await window.showOpenFilePicker({
        types: [{
          description: 'json',
          accept: {
            'application/json': ['.json']
          }
        }],
        multiple: false,
        id: 'cos'
      })

      console.log("filehandler ", vaultFileHandler[0])

      if (vaultFileHandler[0].kind === 'file') {

        const vaultFile = await vaultFileHandler[0].getFile()

        console.log("file content ", vaultFile)

        let content = await vaultFile.text()

        this.state.vaults = [{
          fileHandler: vaultFileHandler[0],
          fileName: vaultFile.name,
          fileContent: JSON.parse(content)
        }]

        console.log("all vaults ", this.state.vaults)
      }
      //navigator.storage.getDirectory()
    } catch (error) {
      console.log("ERROR open Database ", error)
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

  setVault(vault: IVaultStore) {
    console.log("vault-store | setVault ", vault)
    this.state.directories = vault.directories
    this.state.keys = vault.keys
    this.state.rootDirectories = vault.rootDirectories
    console.log("state now ", this.state)
  }
}

export const vaultStore = new VaultStore(VAULT_STORE_NAME);