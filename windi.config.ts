import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  theme: {
    colors: {
      primary: "#3fd2c7",
      secondary: "#99ddff",
      background: "#00458b"
    },
    extend: {

    },
    screens: {
      tablet: '640px',
      laptop: '1024px',
      desktop: '1280px',
    },
  },
})