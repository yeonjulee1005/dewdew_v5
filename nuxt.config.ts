// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process'
import packageJson from './package.json'

// 프로덕션 환경 체크
const isProduction = process.env.NODE_ENV === 'production'
const isVercelProduction = process.env.VERCEL_ENV === 'production'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    // @nuxt/hints는 개발 환경에서만 활성화 (알파 버전 hydration 버그 방지)
    ...(process.env.NODE_ENV === 'development' ? ['@nuxt/hints'] : []),
    '@nuxt/a11y',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/content',
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
    'nuxt-time',
    'nuxt-ai-ready',
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
    enabled: !isProduction, // 프로덕션에서 비활성화
    timeline: {
      enabled: !isProduction,
    },
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'ko' },
      link: [
        // Pretendard 동적 서브셋 (unicode-range 분할 로딩 — 2MB full font 대비 대폭 절감)
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css',
          crossorigin: 'anonymous',
        },
        // Anton preload
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          href: '/fonts/Anton-Regular.woff2',
          crossorigin: 'anonymous',
        },
      ],
    },
  },
  css: [
    '~/assets/scss/style.scss',
    '~/assets/css/main.css',
  ],
  site: {
    name: 'Dewdew Dev Portfolio Website',
    description: 'Dewdew, Software Engineer.',
    // 프로덕션에서는 항상 https://www.dewdew.dev 사용 (Vercel preview URL 제외)
    url: isVercelProduction
      ? 'https://www.dewdew.dev'
      : (process.env.NUXT_PUBLIC_SITE_URL ?? 'http://localhost:4110'),
    defaultLocale: 'ko',
    indexable: true,
  },
  colorMode: {
    preference: 'system',
    fallback: 'dark',
    storage: 'localStorage',
    storageKey: 'nuxt-color-mode',
  },
  content: {
    // Vercel 서버리스 환경에서 better-sqlite3 에러 방지
    // Node.js v22.5.0+ 네이티브 SQLite 모듈 사용
    experimental: {
      sqliteConnector: 'native',
    },
    build: {
      markdown: {
        toc: {
          depth: 3,
        },
        highlight: {
          langs: [
            'javascript', 'typescript', 'vue', 'html', 'css', 'json', 'bash',
          ],
          preload: ['js', 'ts', 'json', 'vue'],
          theme: {
            default: 'github-light',
            dark: 'github-dark',
            sepia: 'dracula-soft',
          },
        },
      },
    },
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
    nodeEnv: process.env.NODE_ENV ?? 'development',
    supabaseUrl: process.env.SUPABASE_URL ?? '',
    supabaseKey: process.env.SUPABASE_KEY ?? '',
    public: {
      nodeEnv: process.env.NODE_ENV ?? 'development',
      appVersion: JSON.stringify(packageJson.version),
      siteUrl: isVercelProduction
        ? 'https://www.dewdew.dev'
        : (process.env.BASE_URL ?? process.env.NUXT_PUBLIC_SITE_URL ?? 'http://localhost:4500'),
      supabaseUrl: process.env.SUPABASE_URL ?? '',
      supabaseKey: process.env.SUPABASE_KEY ?? '',
      emailJsKey: process.env.EMAILJS_KEY,
      emailJSsTemplate: process.env.EMAILJS_TEMPLATE,
      dataPortalApiKey: process.env.DATA_PORTAL_API_KEY,
      partykitHost: process.env.PARTYKIT_HOST,
    },
  },
  sourcemap: {
    server: !isProduction, // 프로덕션에서 비활성화
    client: !isProduction,
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
      // 블로그 포스트를 자동으로 크롤링하여 prerender
      crawlLinks: true,
    },
    routeRules: {
      // 홈페이지 정적 렌더링 (프로덕션에서만)
      '/': {
        prerender: isProduction,
        ...(!isProduction && {
          headers: {
            'X-Robots-Tag': 'noindex, nofollow',
          },
        }),
      },
      // 블로그 페이지: prerender하여 정적 파일로 생성
      // Vercel 서버리스 환경에서 better-sqlite3 에러를 방지하기 위해
      // 모든 블로그 페이지를 빌드 시점에 prerender
      '/blog/**': {
        prerender: true,
      },
      // Three.js 페이지 정적 렌더링 (프로덕션에서만)
      '/threejs': { prerender: isProduction },
      // 서비스 워커 파일을 정적 파일로 처리 (Vue Router에서 제외)
      '/sw.js': {
        prerender: false,
        ssr: false,
        headers: {
          'Cache-Control': 'public, max-age=0, must-revalidate',
          'Content-Type': 'application/javascript',
        },
        cors: true,
      },
      '/workbox-*.js': {
        prerender: false,
        ssr: false,
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
      // 폰트 파일 캐싱 최적화
      '/fonts/**': {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
        cors: true,
      },
      // CSS 파일 캐싱 최적화
      '/_nuxt/**/*.css': {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
        cors: true,
      },
    },
  },
  vite: {
    server: {
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 4110,
      },
    },
    build: {
      rollupOptions: {
        treeshake: {
          // unified/remark/rehype/micromark are pure utilities — no true side effects
          // Allows Rollup to tree-shake the markdown parser when parseMarkdown() isn't called
          moduleSideEffects: (id) => {
            const pureParsers = [
              '/unified/',
              '/remark-parse/',
              '/remark-rehype/',
              '/micromark',
              '/mdast-',
              '/hast-util',
              '/hast-to-',
              '/unist-',
              '/vfile',
              '/remark-mdc/',
              '/remark-stringify/',
              '/rehype-',
              '@nuxtjs/mdc/dist/runtime/parser',
              '@nuxtjs/mdc/dist/runtime/stringify',
            ]
            if (pureParsers.some(p => id.includes(p))) return false
            return true
          },
        },
        output: {
          manualChunks(id) {
            if (id.includes('@egjs/flicking')) return 'carousel'
            if (id.includes('shiki') || id.includes('syntax-highlight')) return 'syntax-highlight'
            if (id.includes('@supabase')) return 'supabase'
            if (id.includes('motion')) return 'animation'
            if (id.includes('three') || id.includes('Three')) return 'threejs'
            if (id.includes('@giscus')) return 'giscus'
            if (id.includes('@nuxt/content') || id.includes('@nuxtjs/mdc')) return 'content'
            if (id.includes('dayjs')) return 'dayjs'
            if (id.includes('typeit')) return 'typeit'
            if (id.includes('partysocket')) return 'partykit'
            if (id.includes('@emailjs')) return 'emailjs'
            if (id.includes('yup')) return 'form-validation'
          },
        },
      },
      sourcemap: !isProduction, // 프로덕션에서 비활성화
      cssMinify: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isVercelProduction,
          drop_debugger: isVercelProduction,
          pure_funcs: isVercelProduction ? ['console.log', 'console.info', 'console.debug'] : [],
        },
      },
    },
  },
  typescript: {
    shim: false,
  },
  aiReady: {
    contentSignal: {
      aiTrain: false,
      search: true,
      aiInput: true,
    },
    llmsTxt: {
      sections: [
        {
          title: 'Pages',
          links: [
            { title: 'Home', href: '/', description: 'Portfolio intro and navigation' },
            { title: 'AI Chat', href: '/ai', description: 'RAG-based AI chat about resume data' },
            { title: 'Three.js', href: '/threejs', description: 'WebGL works gallery' },
            { title: 'Blog', href: '/blog', description: 'Reflection and tech blog posts' },
          ],
        },
      ],
      notes: 'AI component demo at /ai/components is excluded from search indexing.',
    },
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
    checker: false,
  },
  i18n: {
    langDir: 'locales',
    locales: [
      { code: 'ko', file: 'ko.ts' },
      { code: 'en', file: 'en.ts' },
    ],
    defaultLocale: 'ko',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: false,
      alwaysRedirect: false,
      redirectOn: 'root',
    },
  },
  icon: {
    serverBundle: {
      collections: [
        'lucide',
        'simple-icons',
      ],
    },
    clientBundle: {
      scan: true,
      sizeLimitKb: 256,
    },
    provider: 'iconify',
  },
  image: {
    format: ['svg', 'png', 'jpg', 'jpeg', 'webp'],
    quality: 80,
    screens: {
      'xs': 320,
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      'xxl': 1536,
      '2xl': 1536,
    },
  },
  ogImage: {
    zeroRuntime: true,
    compatibility: {
      dev: { takumi: false, browser: false },
      runtime: { takumi: false, browser: false },
      prerender: { takumi: false, browser: false },
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
    registerType: 'prompt',
    filename: 'sw.js',
    strategies: 'generateSW',
    workbox: {
      navigateFallback: null,
      navigateFallbackDenylist: [/.*/],
      globPatterns: ['**/*.{js,json,css,html,txt,svg,png,ico,webp,woff,woff2,ttf,eot,otf,wasm}'],
      globIgnores: ['**/_nuxt/**/*.js', '**/_nuxt/**/*.mjs', '**/_payload.json'],
      // 정적 자산 캐싱 전략
      cleanupOutdatedCaches: true,
      skipWaiting: true,
      clientsClaim: true,
      dontCacheBustURLsMatching: /\.\w{8}\./,
      runtimeCaching: [
        {
          // 페이지 요청: 네트워크만 사용 (캐시 사용 안 함)
          // 새 배포 시 오래된 페이지로 리디렉션되는 문제 방지
          urlPattern: ({ request }) => request.mode === 'navigate',
          handler: 'NetworkOnly', // 캐시를 전혀 사용하지 않음
        },
        // Supabase Storage 이미지: 캐시 우선 (변경이 거의 없으므로 긴 캐시)
        {
          urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/v1\/object\/.*\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'supabase-images-cache',
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 365 * 24 * 60 * 60, // 1년 (이미지는 거의 변경되지 않음)
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // 일반 이미지: 캐시 우선 (오래된 이미지도 괜찮음)
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
        // Supabase Storage API (이미지 제외): 네트워크 우선 (최신 데이터 중요)
        {
          urlPattern: ({ url }) => {
            // 이미지 URL은 제외
            return url.href.includes('supabase.co')
              && !/\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/.test(url.pathname)
          },
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
            // 이미지는 위의 Supabase Storage 이미지 캐싱 전략에서 처리
            matchOptions: {
              ignoreSearch: false,
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
        // 로컬 API 요청: 네트워크 우선, 실패 시 캐시 사용
        {
          urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 5 * 60, // 5분
            },
            networkTimeoutSeconds: 3,
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
    },
    devOptions: {
      enabled: false,
      suppressWarnings: true,
      type: 'module',
    },
  },
  robots: {
    disallow: ['/ai/components'],
  },
  schemaOrg: {
    identity: {
      type: 'Person',
      name: 'Yeonju Lee',
      url: 'https://www.dewdew.dev',
      sameAs: [
        'https://twitter.com/dewdew',
        'https://github.com/yeonjulee1005',
        'https://www.linkedin.com/in/yeonjulee1005/',
      ],
    },
  },
  sitemap: {
    exclude: ['/ai/components'],
    urls: [
      { loc: '/', priority: 1, changefreq: 'monthly' },
      { loc: '/ai', priority: 0.9, changefreq: 'monthly' },
      { loc: '/threejs', priority: 0.8, changefreq: 'monthly' },
      { loc: '/blog', priority: 0.8, changefreq: 'weekly' },
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
      exclude: [
        '/',
        '/blog',
        '/blog/**',
        '/ai',
        '/ai/**',
        '/threejs',
        '/threejs/**',
      ],
      cookieRedirect: false, // 쿠키 기반 리디렉션 비활성화
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
