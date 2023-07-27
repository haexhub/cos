// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from "url";

const moduleExclude = (match: string) => {
  const m = (id: string) => id.indexOf(match) > -1;
  return {
    name: `exclude-${match}`,
    resolveId(id: string) {
      if (m(id)) return id;
    },
    load(id: string) {
      if (m(id)) return `export default {}`;
    },
  };
};

export default defineNuxtConfig({
  alias: {
    "~": fileURLToPath(new URL("./", import.meta.url)),
    "@": fileURLToPath(new URL("./", import.meta.url)),
    assets: fileURLToPath(new URL("./assets", import.meta.url)),
    public: fileURLToPath(new URL("./public", import.meta.url)),
  },

  components: [
    {
      path: "composables/user",
    },
    "@/components",
  ],

  css: ["~/assets/css/main.css"],

  devtools: { enabled: true },

  imports: {
    dirs: ["stores"],
  },

  modules: [
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore"],
      },
    ],
    "nuxt-swiper",
    "@nuxtjs/fontaine",
    "@nuxtjs/i18n",
  ],

  i18n: {
    vueI18n: "./i18n.config.ts",
    locales: ["de", "en"],
    detectBrowserLanguage: false,
    strategy: "prefix",
    defaultLocale: "de",
    trailingSlash: false,
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  vite: {
    optimizeDeps: {
      include: [
        "gun",
        "gun/gun",
        "gun/sea",
        "gun/sea.js",
        "gun/lib/then",
        "gun/lib/webrtc",
        "gun/lib/radix",
        "gun/lib/radisk",
        "gun/lib/store",
        "gun/lib/rindexed",
        "gun/*",
        "text-encoding",
      ],
    },
    plugins: [moduleExclude("text-encoding")],
  },
});
