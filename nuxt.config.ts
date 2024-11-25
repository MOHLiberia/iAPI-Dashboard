// https://nuxt.com/docs/api/configuration/nuxt-config

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
    '@pinia/nuxt'
  ],
  devServer: {
    port: 3001
  },
  runtimeConfig: {
    public: {
      apiUrl: '',
      apiKey: '',
    }
  },
  primevue: {
    importTheme: {
      from: '@/theme/myTheme.js'
    }
  },
})