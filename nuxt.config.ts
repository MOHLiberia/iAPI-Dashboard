// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path';

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4
  },
  devtools: { enabled: true },
  modules: [
    '@primevue/nuxt-module',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    'pinia-plugin-persistedstate/nuxt',
  ],
  devServer: {
    port: 3001
  },
  runtimeConfig: {
    public: {
      apiUrl: 'localhost:3000/api/v1',
      apiKey: '12345',
    }
  },
  primevue: {
    importTheme: {
      from: resolve(__dirname, 'app/theme/myTheme.ts')
    },
  },
  icon: {
    provider: 'iconify',
    serverBundle: 'local'
  }
})