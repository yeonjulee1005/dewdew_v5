// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process'
import packageJson from './package.json'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxtjs/color-mode',
    '@nuxt/ui',
    '@nuxtjs/mdc',
    '@nuxtjs/supabase',
    '@nuxtjs/i18n',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/device',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
    'dayjs-nuxt',
    'pinia-plugin-persistedstate',
    '@nuxtjs/seo',
  ],
  imports: {
    dirs: [
      'components/**',
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
    '~/assets/scss/style.scss',
    '~/assets/css/main.css',
  ],
  site: {
    name: 'Dewdew',
    url: process.env.NUXT_PUBLIC_SITE_URL ?? process.env.NUXT_ENV_VERCEL_URL ?? 'http://localhost:4110',
  },
  colorMode: {
    preference: 'system',
    fallback: 'dark',
    storage: 'localStorage',
    storageKey: 'nuxt-color-mode',
  },
  mdc: {
    components: {
      prose: true,
    },
  },
  ui: {
    fonts: false,
    prefix: 'Dd',
  },
  runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL ?? '',
    supabaseKey: process.env.SUPABASE_KEY ?? '',
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
    preset: process.env.VERCEL ? 'vercel' : undefined,
    compressPublicAssets: {
      brotli: true,
      gzip: true,
    },
    prerender: {
      failOnError: false,
    },
    routeRules: {
      // 서비스 워커 파일을 정적 파일로 처리 (Vue Router에서 제외)
      '/sw.js': {
        headers: {
          'Cache-Control': 'public, max-age=0, must-revalidate',
          'Content-Type': 'application/javascript',
        },
        cors: true,
      },
      '/workbox-*.js': {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Content-Type': 'application/javascript',
        },
        cors: true,
      },
      '/manifest.webmanifest': {
        headers: {
          'Content-Type': 'application/manifest+json',
        },
        cors: true,
      },
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
  ogImage: {
    fonts: [
      'Source Code Pro',
    ],
    defaults: {
      renderer: 'satori',
    },
  },
  pinia: {
    storesDirs: [
      './stores/**',
    ],
  },
  pwa: {
    scope: '/',
    base: '/',
    injectRegister: 'auto',
    registerType: 'autoUpdate',
    filename: 'sw.js',
    strategies: 'generateSW',
    workbox: {
      navigateFallback: undefined,
      globPatterns: ['**/*.{js,json,css,html,txt,svg,png,ico,webp,woff,woff2,ttf,eot,otf,wasm}'],
      // _nuxt 디렉토리의 해시가 변경되는 파일들은 프리캐시에서 제외 (런타임 캐싱으로 처리)
      globIgnores: ['**/_nuxt/**/*.js', '**/_nuxt/**/*.mjs'],
      // 정적 자산 캐싱 전략
      cleanupOutdatedCaches: true,
      skipWaiting: true,
      clientsClaim: true,
      // 404 응답을 무시하고 계속 진행 (프리캐시 실패 시에도 Service Worker가 정상 작동)
      dontCacheBustURLsMatching: /\.\w{8}\./,
      // 런타임 캐싱 전략 설정
      runtimeCaching: [
        // 페이지 요청: 네트워크 우선, 실패 시 캐시 사용
        {
          urlPattern: /^https?:\/\/.*$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pages-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 24 * 60 * 60, // 24시간
            },
            networkTimeoutSeconds: 3,
          },
        },
        // 이미지: 캐시 우선 (오래된 이미지도 괜찮음)
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30일
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // 폰트: 캐시 우선 (변경이 거의 없음)
        {
          urlPattern: /\.(?:woff|woff2|ttf|eot|otf)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'fonts-cache',
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 365 * 24 * 60 * 60, // 1년
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // 기상청 API: 네트워크 우선 (최신 데이터 중요)
        {
          urlPattern: /^https:\/\/apis\.data\.go\.kr\/.*$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'weather-api-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60, // 1시간
            },
            networkTimeoutSeconds: 5,
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // Supabase API: 네트워크 우선 (최신 데이터 중요)
        {
          urlPattern: /^https:\/\/.*\.supabase\.co\/.*$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'supabase-api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 5 * 60, // 5분
            },
            networkTimeoutSeconds: 5,
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // Nuxt 빌드 파일 (_nuxt 디렉토리): 네트워크 우선 (해시 변경 대응)
        {
          urlPattern: /\/_nuxt\/.*\.(?:js|mjs|css)$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'nuxt-assets-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 7 * 24 * 60 * 60, // 7일
            },
            networkTimeoutSeconds: 3,
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // 정적 자산 (JS, CSS 등): StaleWhileRevalidate
        {
          urlPattern: /\.(?:js|css|json)$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-assets-cache',
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 7 * 24 * 60 * 60, // 7일
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
    manifest: {
      name: 'DewDew',
      short_name: 'Dewdew',
      description: 'Frontend Developer DewDew',
      theme_color: '#f59e42',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait-primary',
      scope: '/',
      start_url: '/',
      lang: 'ko',
      dir: 'ltr',
      icons: [
        {
          src: '/image/web-app-manifest-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/image/web-app-manifest-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
      display_override: ['standalone', 'window-controls-overlay', 'browser'],
      categories: ['productivity', 'utilities'],
      prefer_related_applications: false,
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 20,
    },
    devOptions: {
      enabled: false,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
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
