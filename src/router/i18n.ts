import { i18n, translation } from '@/i18n'
import router, { isRouteAvailable } from './index'

router.beforeEach((to) => {
  console.log(
    'router guard i18n enter',
    to,
    translation.isLocaleSupported(to.params.locale as string),
    translation.defaultLocale
  )

  to.name = to.name ?? 'index'

  if (
    translation.currentLocale !== to.params.locale &&
    translation.isLocaleSupported(to.params.locale as string)
  ) {
    translation.currentLocale = to.params.locale as string
  }

  if (!translation.isLocaleSupported(to.params.locale as string)) {
    return `/${translation.currentLocale}${to.path}`.replace(/\/$/g, '')
  }

  console.log('router guard i18n leave', to)
})

export default router
