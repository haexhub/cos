import { PersistentStore } from "./main";
import { VAULT_STORE_NAME } from "./store-names";


export interface IVaultDirectory extends Object {
  name: string
  id: string
  keys: Array<IVaultKey>
  subdirectories: Array<IVaultDirectory>
}

export interface IVaultKey extends Object {
  id: string,
  title: string
  description: string
  username: string
  password: string
  urls: Array<string>
  attributes: Array<Object>
}

export interface IVaultStore extends Object {
  vaults: Array<IVaultDirectory>,
  currentKeys: Array<IVaultKey>
}

class VaultStore extends PersistentStore<IVaultStore> {
  protected data(): IVaultStore {
    return {
      vaults: [],
      currentKeys: []
    };
  }
}

export const vaultStore = new VaultStore(VAULT_STORE_NAME);