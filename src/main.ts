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
  .component("basic-textarea", Components.BasicTextArea)

  .component("Icon", Components.Icon)
  .component("IconPencil", Components.IconPencil)
  .component("IconPencilOff", Components.IconPencilOff)
  .component("IconDatabasePlus", Components.IconDatabasePlus)
  .component("IconDatabaseSearch", Components.IconDatabaseSearch)
  .component("IconPlus", Components.IconPlus)
  .component("IconFolder", Components.IconFolder)
  .component("IconKey", Components.IconKey)
  .component("IconEye", Components.IconEye)
  .component("IconEyeOff", Components.IconEyeOff)
  .component("IconCopy", Components.IconCopy)
  .component("IconDungeon", Components.IconDungeon)
  .component("IconHistory", Components.IconHistory)
  .component("IconInfo", Components.IconInfo)
  .component("IconCalendar", Components.IconCalendar)
  .component("IconSDCard", Components.IconSDCard)
  .component("IconMessage", Components.IconMessage)

  //.component("vault-menu-bar", Components.VaultMenuBar)
  //.component("vault-directory", Components.VaultDirectory)
  .component("vault-directory-details", Components.VaultDirectoryDetails)
  //.component("vault-key", Components.VaultKey)
  .component("vault-key-details", Components.VaultKeyDetails)
  .component("vault-item", Components.VaultItem)
  //.component("vault-file", Components.VaultFile)
  //.component("vault-key-view", Components.VaultKeyView)
  .component("vault-overlay", Components.VaultOverlay)
  .component("vault-logo", Components.VaultLogo)



  .component("vault-menu-bar", Components.VaultMenubar)
  .component("vault-menu-bar-vault-items", Components.VaultMenuBarItems)

  .component("dropdown-menu", Components.DropdownMenu)
  //.component("context-menu", Components.ContextMenu)
  //.component("context-menu-directory", Components.ContextMenuDirectory)

  .use(router)
  .mount('#app')