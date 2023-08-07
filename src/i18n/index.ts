import { createI18n } from 'vue-i18n'
import type { RouterMatcher, RouteLocation, RouteLocationRaw } from 'vue-router'

export const i18n = createI18n({
  legacy: false,
  allowDynamic: true,
  locale: import.meta.env.VITE_DEFAULT_LOCALE,
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE,
})

export const translation = {
  get supportedLocales(): string[] {
    return import.meta.env.VITE_SUPPORTED_LOCALES.split(',') || ['de']
  },

  get defaultLocale(): string {
    return import.meta.env.VITE_DEFAULT_LOCALE || 'de'
  },

  get currentLocale() {
    return i18n.global.locale.value || this.defaultLocale
  },

  set currentLocale(newLocale: string) {
    i18n.global.locale.value = newLocale
  },

  isLocaleSupported(locale: string) {
    return translation.supportedLocales.includes(locale)
  },

  async switchLanguage(newLocale: string) {
    if (this.isLocaleSupported(newLocale)) {
      translation.currentLocale = newLocale
    } else {
      translation.currentLocale = translation.defaultLocale
    }
    localStorage.setItem('user-locale', translation.currentLocale)
  },

  i18nRoute(to: RouteLocation) {
    return {
      ...to,
      name: to.name || '/',
      params: {
        ...to.params,
        locale: this.currentLocale || 'de',
      },
    }
  },
}
