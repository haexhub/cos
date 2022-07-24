import Vue, { compile, createApp } from 'vue'
import App from './App.vue'
import 'virtual:windi.css'
import router from './router'
//@ts-ignore
import * as Components from "@/components"
import AppLayout from "@/layout/AppLayout.vue";

const app = createApp(App)
  .component("app-layout", AppLayout)

  .component("basic-input", Components.BasicInput)
  .component("basic-button", Components.BasicButton)

  .component("Icon", Components.Icon)
  .component("IconEdit", Components.IconEdit)
  .component("IconDatabasePlus", Components.IconDatabasePlus)
  .component("IconDatabaseSearch", Components.IconDatabaseSearch)
  .component("IconPlus", Components.IconPlus)
  .component("IconFolder", Components.IconFolder)
  .component("IconKey", Components.IconKey)
  .component("IconEye", Components.IconEye)
  .component("IconEyeOff", Components.IconEyeOff)

  .component("vault-directory", Components.VaultDirectory)
  .component("vault-directory-details", Components.VaultDirectoryDetails)
  .component("vault-key", Components.VaultKey)
  .component("vault-key-details", Components.VaultKeyDetails)
  .component("c-vault-store", Components.VaultStore)
  .component("vault-file", Components.VaultFile)
  .component("vault-key-view", Components.VaultKeyView)
  .component("vault-overlay", Components.VaultOverlay)

  .component("dropdown-menu", Components.DropdownMenu)
  .component("context-menu", Components.ContextMenu)
  .component("context-menu-directory", Components.ContextMenuDirectory)

  .use(router)
  .mount('#app')