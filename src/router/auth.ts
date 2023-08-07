import { translation } from '@/i18n'
import { useUser } from '../composables/composables'
import router from './index'

router.beforeEach((to, from) => {
  console.log('router guard auth', to)
  const { user } = useUser()
  if (!user.auth && to.name !== 'index') {
    return {
      path: `/${translation.currentLocale}`,
    }
  }
})

export default router
