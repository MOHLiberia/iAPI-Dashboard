// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-05-07',
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
    importTheme: { from: '@/theme/myTheme.ts' },
  },
  icon: {
    provider: 'iconify',
    serverBundle: 'local'
  },
  build: {
    transpile: ['@/']
  },
  vite: {
    server: {
      allowedHosts: true
    }
  }
})