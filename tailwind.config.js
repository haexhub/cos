const farbe = require("tailwindcss/colors");
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],

  fontFamily: {
    sans: ["Graphik", "sans-serif"],
    serif: ["Merriweather", "serif"],
  },

  theme: {
    extend: {
      colors: {
        primary: farbe.teal,
        secondary: farbe.cyan,
        success: farbe.emerald[500],
        warning: farbe.orange[500],
        error: farbe.red[500],
        dark: farbe.slate,
      },
      fontFamily: {
        logo: ["Logo"],
      },
    },
  },
  plugins: [],
};
