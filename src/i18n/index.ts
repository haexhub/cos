import type { EventBusEvents } from "@vueuse/core";
import { createI18n } from "vue-i18n";
import type { RouteLocation } from "vue-router";
import type { RouterMatcher } from "vue-router/auto";

export const i18n = createI18n({
  legacy: false,
  allowDynamic: true,
  locale: import.meta.env.VITE_DEFAULT_LOCALE,
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE,
});

export const translation = {
  get supportedLocales() {
    return import.meta.env.VITE_SUPPORTED_LOCALES.split(",");
  },

  set currentLocale(newLocale: string) {
    i18n.global.locale.value = newLocale;
  },

  isLocaleSupported(locale: string) {
    // <--- 1
    return translation.supportedLocales.includes(locale);
  },

  async routeMiddleware(to: RouteLocation, _from: RouteLocation, next) {
    const locale = to.params.locale;
  },

  async switchLanguage(event: string) {
    const newLocale = (event.target as HTMLInputElement)?.value;
    translation.currentLocale = newLocale;
  },
};
