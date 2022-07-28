import { createRouter, createWebHashHistory, createWebHistory } from "vue-router"
import VaultView from "@/views/vault/view.vue"
import VaultOpen from "@/views/vault/open.vue"
import Calendar from "@/views/calendar.vue"
import Storage from "@/views/storage.vue"
import Message from "@/views/message.vue"

const routes = [
  { path: "/", component: VaultOpen },
  { path: "/vault/view", component: VaultView },
  { path: "/calendar", component: Calendar },
  { path: "/storage", component: Storage },
  { path: "/message", component: Message }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router