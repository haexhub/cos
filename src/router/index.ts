import type { RouteLocation } from "vue-router";
import type { NavigationGuardWithThis } from "vue-router/auto";
import { createRouter, createWebHistory } from "vue-router/auto";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
});

export default router;
