import { createRouter, createWebHashHistory, createWebHistory } from "vue-router"
import VaultView from "@/views/VaultView.vue"


const routes = [
  { path: "/", component: VaultView }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router