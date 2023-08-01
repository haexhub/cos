import { fileURLToPath, URL } from "node:url";
import Components from "unplugin-vue-components/vite";
import VueRouter from "unplugin-vue-router/vite";
import { defineConfig } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import { VueRouterAutoImports } from "unplugin-vue-router";
import { unheadVueComposablesImports } from "@unhead/vue";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

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

import vue from "@vitejs/plugin-vue";
import { dirname, resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },

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
    ],
  },

  plugins: [
    VueRouter({
      routesFolder: "src/pages",
      extensions: [".vue"],
    }),

    vue(),

    AutoImport({
      dts: true,
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],

      imports: [
        "vue",
        "pinia",
        "vue-i18n",
        "@vueuse/core",
        unheadVueComposablesImports,
        VueRouterAutoImports,
        {
          // add any other imports you were relying on
          "vue-router/auto": ["useLink"],
        },
      ],
    }),

    VueI18nPlugin({}),

    moduleExclude("text-encoding"),

    Components({
      dts: true,
      include: ["./**/*.vue", "./**/*.ts", "./*.vue", "./*.ts"],
      directoryAsNamespace: true,
    }),
  ],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
