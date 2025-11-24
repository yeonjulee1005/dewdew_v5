// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process'
import packageJson from './package.json'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    '@nuxtjs/supabase',
    '@nuxtjs/i18n',
    '@nuxtjs/stylelint-module',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'dayjs-nuxt',
    'pinia-plugin-persistedstate',
  ],
  imports: {
    dirs: [
      'composables/**',
      'stores/**',
    ],
  },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'ko' },
    },
  },
  css: [
    '~/assets/style.scss',
  ],
  // site: {
  //   name: 'Dewdew',
  //   url: process.env.NUXT_PUBLIC_SITE_URL ?? process.env.NUXT_ENV_VERCEL_URL ?? 'http://localhost:4600',
  // },
  colorMode: {
    preference: 'light',
    fallback: 'system',
  },
  ui: {
    fonts: false,
    prefix: 'Dd',
  },
  runtimeConfig: {
    public: {
      appVersion: JSON.stringify(packageJson.version),
      siteUrl: process.env.BASE_URL ?? process.env.NUXT_PUBLIC_SITE_URL ?? process.env.NUXT_ENV_VERCEL_URL ?? 'http://localhost:4500',
      supabaseUrl: process.env.SUPABASE_URL ?? '',
      supabaseKey: process.env.SUPABASE_KEY ?? '',
      emailJsKey: process.env.EMAILJS_KEY,
      emailJSsTemplate: process.env.EMAILJS_TEMPLATE,
      dataPortalApiKey: process.env.DATA_PORTAL_API_KEY,
    },
  },
  sourcemap: {
    server: true,
    client: true,
  },
  compatibilityDate: '2025-07-15',
  nitro: {
    preset: 'vercel',
    compressPublicAssets: {
      brotli: true,
      gzip: true,
    },
    prerender: {
      failOnError: false,
    },
  },
  vite: {
    build: {
      sourcemap: true,
      cssMinify: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: process.env.VERCEL_ENV === 'production',
        },
      },
    },
  },
  typescript: {
    shim: false,
  },
  dayjs: {
    locales: ['ko'],
    plugins: ['relativeTime', 'utc', 'timezone'],
    defaultLocale: 'ko',
    defaultTimezone: 'Asia/Seoul',
  },
  eslint: {
    config: {
      stylistic: true,
    },
    checker: true,
  },
  i18n: {
    langDir: 'locales',
    locales: [
      { code: 'ko', file: 'ko.ts' },
      { code: 'en', file: 'en.ts' },
    ],
    defaultLocale: 'ko',
    strategy: 'no_prefix',
  },
  image: {
    format: ['svg', 'png', 'jpg', 'jpeg', 'webp'],
  },
  // ogImage: {
  //   fonts: [
  //     'Source Code Pro',
  //   ],
  //   defaults: {
  //     renderer: 'satori',
  //   },
  // },
  pinia: {
    storesDirs: [
      './stores/**',
    ],
  },
  stylelint: {
    lintOnStart: true,
  },
  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      // exclude: [
      //   '/',
      // ],
    },
    clientOptions: {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    },
  },
  vueuse: {
    ssrHandlers: false,
  },
})
