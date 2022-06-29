import Vue, { createApp } from 'vue'
import App from './App.vue'
import 'virtual:windi.css'
import router from './router'
import * as Components from "@/components"
import AppLayout from "@/layout/AppLayout.vue";

import {
  Vuetable,
  VuetablePagination,
  VuetablePaginationDropDown,
  VuetablePaginationInfo
} from "vuetable-2"

import VueGoodTablePlugin from 'vue-good-table-next';

// import the styles 
/* import 'vue-good-table-next/dist/vue-good-table-next.css' */
import SmartTable from 'vuejs-smart-table'




const app = createApp(App)
  .component("app-layout", AppLayout)
  .component("vault-directory", Components.VaultDirectory)
  .component("vault-key", Components.VaultKey)
  //.component("vault-store", Components.VaultStore)
  .component("vault-store", Components.VaultStore)
  .component("context-menu", Components.ContextMenu)
  .component("context-menu-directory", Components.ContextMenuDirectory)
  .component("vuetable", Vuetable)
  .component("vuetable-pagination", VuetablePagination)
  .component("vuetable-pagination-dropdown", VuetablePaginationDropDown)
  .component("vuetable-pagination-info", VuetablePaginationInfo)
  .use(router)
  //.use(VueGoodTablePlugin)
  .use(SmartTable)
  .mount('#app')