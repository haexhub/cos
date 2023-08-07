import type { RouteLocation } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router/auto'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
})

export const isRouteAvailable = (route: RouteLocation) => {
  return router.getRoutes().some((avaiableRoute) => {
    console.log('isRouteAvailable', avaiableRoute.name, route.name)
    return (
      avaiableRoute.name === route.name || avaiableRoute.path === route.path
    )
  })
}

export default router
