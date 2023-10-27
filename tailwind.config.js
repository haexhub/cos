const farbe = require('tailwindcss/colors')
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],

  fontFamily: {
    sans: ['Graphik', 'sans-serif'],
    serif: ['Merriweather', 'serif'],
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
        logo: ['Logo'],
      },
      backgroundImage: {
        logo: "url('/logo.svg')",
      },
    },
  },
  plugins: [],
}
