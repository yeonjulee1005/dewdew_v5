# Nuxt 4 프로젝트 컨벤션

참고: [Nuxt 4 Introduction](https://nuxt.com/docs/4.x/getting-started/introduction)

## 디렉터리 구조

| 경로 | 용도 |
|------|------|
| `app/pages/` | 파일 기반 라우팅 |
| `app/components/` | Vue 컴포넌트 (auto-import) |
| `app/layouts/` | 레이아웃 |
| `app/composables/` | composable (auto-import) |
| `app/plugins/` | Nuxt 플러그인 |
| `app/assets/` | CSS, SCSS 등 |
| `server/api/` | Nitro API 라우트 |
| `server/middleware/` | 서버 미들웨어 |
| `i18n/locales/` | i18n JSON locale |
| `nuxt.config.ts` | Nuxt 설정 (루트) |

## 코딩 원칙

- Vue 3 Composition API + `<script setup lang="ts">` 우선
- Nuxt auto-import 활용 (`useRoute`, `useI18n`, `useHead` 등 수동 import 불필요)
- 데이터 페칭: `useFetch` / `useAsyncData` (SSR 호환)
- 상태: Pinia (`app/stores/`)
- UI: Nuxt UI (`Dd` prefix — `app.config.ts` 참고)
- i18n: `@nuxtjs/i18n`, locale 파일은 `i18n/locales/{ko,en}.json`
- 스타일: Tailwind CSS 4 + SCSS (`app/assets/`)

## 패키지·스크립트

- 패키지 매니저: **bun**
- `bun run dev` — 개발 서버 (port 4002)
- `bun run build` — 프로덕션 빌드
- `bun run lint` — ESLint
- `bunx nuxi typecheck` — TypeScript 검사
- `bun run test` — Vitest

## 배포

- Vercel preset (`nuxt.config.ts` nitro.preset)
- 로컬 preview: `node .output/server/index.mjs` (node-server 빌드 후)

## 리뷰 시 확인 항목

- SSR/CSR 경계 (`import.meta.client`, `.client.vue` suffix)
- i18n 키 누락 (`ko.json` / `en.json` 동시 반영)
- Nitro preset·환경변수 분기 (`VERCEL`, `NITRO_PRESET`)
- `@vercel/analytics` 등은 `@vercel/*/vue` import 사용 (node-server preview 호환)
- SEO·AEO: `.claude/rules/seo-nuxt.md` 및 `/seo-*` 커맨드 참고
