import { createRouter, createWebHashHistory, createWebHistory } from "vue-router"
import VaultView from "@/views/vault/view.vue"
import VaultOpen from "@/views/vault/open.vue"

const routes = [
  { path: "/", component: VaultOpen },
  { path: "/vaultView", component: VaultView }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router