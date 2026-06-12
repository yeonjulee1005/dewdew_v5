# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

AI 에이전트·기여자용 프로젝트 참고 문서입니다. 서비스 소개·사용법은 [README.md](./README.md)를 참고하세요.

## 기술 스택

| 영역 | 기술 |
|------|------|
| Framework | [Nuxt 4](https://nuxt.com) · Vue 3 · TypeScript |
| UI | [Nuxt UI 4](https://ui.nuxt.com) · Tailwind CSS 4 · Sass |
| 상태 | [Pinia](https://pinia.vuejs.org) · pinia-plugin-persistedstate |
| i18n | [@nuxtjs/i18n](https://i18n.nuxtjs.org) (ko/en, strategy: no_prefix) |
| Database | [Supabase](https://supabase.com) (PostgreSQL · pgvector) |
| AI | OpenAI API · Supabase Edge Functions (RAG) |
| SEO/AEO | [@nuxtjs/seo](https://nuxtseo.com) · nuxt-aeo · schema.org |
| PWA | [@vite-pwa/nuxt](https://vite-pwa-org.netlify.app/frameworks/nuxt) |
| 분석 | Vercel Analytics · Speed Insights |
| 배포 | Vercel (Nitro preset) |
| 패키지 매니저 | [Bun](https://bun.sh) |

---

## 프로젝트 구조

```
dewdew_v5/
├── app/                          # Nuxt 4 앱 디렉터리
│   ├── app.vue                   # 루트 컴포넌트
│   ├── app.config.ts             # Nuxt UI 테마·컬러 설정 (Dd prefix)
│   ├── assets/                   # CSS, SCSS
│   ├── components/
│   │   ├── a/                    # 공통 UI (Footer, Forecast, ThemeChange …)
│   │   ├── chat/                 # AI 채팅 컴포넌트
│   │   ├── dynamic/card/         # 동적 렌더링 카드 컴포넌트
│   │   └── intro/                # 인트로 애니메이션 컴포넌트
│   ├── composables/
│   │   ├── chat/                 # useChat (스트리밍 처리)
│   │   ├── data/                 # 위치·날씨 데이터
│   │   ├── forecast/             # 좌표 변환
│   │   ├── formatting/           # 날짜·데이터 포맷팅
│   │   ├── query/                # 쿼리 유틸
│   │   ├── ui/                   # 이미지·색상·UI 헬퍼
│   │   └── validation/           # 입력 유효성 검사
│   ├── layouts/                  # center, default
│   ├── pages/
│   │   ├── index.vue             # 메인 페이지
│   │   └── ai/                   # AI 채팅 관련 페이지
│   ├── plugins/                  # Vercel Analytics, DOMPurify
│   ├── stores/                   # Pinia 상태 (날씨·메뉴)
│   └── types/                    # TypeScript 타입 (supabase, supabase-menu, supabase-resume, supabase-data)
├── server/api/                   # Nuxt Server API 엔드포인트
│   ├── chat/                     # AI 채팅 API
│   ├── menu/                     # 메뉴 API
│   └── resume/                   # 이력서 데이터 API
├── supabase/functions/           # Supabase Edge Functions
│   ├── _shared/                  # 공유 모듈 (RAG, AI provider 등)
│   ├── dewdew-rag-portfolio/     # RAG 포트폴리오 함수
│   └── initialize-embeddings/    # 임베딩 초기화 함수
├── i18n/locales/                 # ko.ts, en.ts
├── public/                       # 정적 에셋, manifest
├── scripts/                      # 버전 관리 스크립트
├── nuxt.config.ts
└── package.json
```

### 페이지 라우팅

| 경로 | 설명 | SEO |
|------|------|-----|
| `/` | 메인 포트폴리오 | index |
| `/ai` | AI 채팅 | index |
| `/ai/components` | 동적 컴포넌트 데모 | noindex |

---

## 시작하기

### 요구 사항

- [Bun](https://bun.sh) 1.2.0+
- Node.js 24.5.0+
- Supabase 계정

### 설치

```bash
git clone https://github.com/yeonjulee1005/dewdew_v5.git
cd dewdew_v5
bun install
```

### 환경 변수

프로젝트 루트에 `.env` 파일을 생성합니다.

```env
SUPABASE_URL=
SUPABASE_KEY=
OPENAI_API_KEY=
```

### 개발 서버

```bash
bun run dev          # http://localhost:4110
```

### 빌드·미리보기

```bash
bun run build
bun run preview
```

### 품질 검사

```bash
bunx nuxi typecheck
bun run lint
bun run lint:fix
```

---

## 스크립트

| 명령 | 설명 |
|------|------|
| `bun run dev` | 개발 서버 (port 4110) |
| `bun run build` | 프로덕션 빌드 |
| `bun run generate` | 정적 사이트 생성 |
| `bun run preview` | 빌드 결과 미리보기 (port 4110) |
| `bun run analyze` | 번들 분석 |
| `bun run lint` | ESLint |
| `bun run lint:fix` | ESLint 자동 수정 |
| `bun run supabase:login` | Supabase 로그인 |
| `bun run supabase:type` | public 스키마 타입 생성 |
| `bun run supabase:type-menu` | menu 스키마 타입 생성 |
| `bun run supabase:type-resume` | resume 스키마 타입 생성 |
| `bun run supabase:type-data` | data 스키마 타입 생성 |
| `bun run supabase:deploy-rag-portfolio` | RAG 포트폴리오 함수 배포 |
| `bun run supabase:deploy-initialize-embeddings` | 임베딩 초기화 함수 배포 |
| `bun run partykit:dev` | PartyKit 로컬 서버 |
| `bun run partykit:deploy` | PartyKit 배포 |
| `bun run fonts:download` | 폰트 다운로드 |
| `bun run version:patch` | YYMM 패치 버전 bump |
| `bun run version:minor` | YYMM 마이너 버전 bump |
| `bun run version:major` | YYMM 메이저 버전 bump |

---

## 코딩 컨벤션

### Vue / Nuxt

- `<script setup lang="ts">` + Composition API 사용
- Nuxt auto-import 활용 — `useRoute`, `useI18n`, `useHead`, composables, stores 수동 import 불필요
- 데이터 페칭: `useFetch` / `useAsyncData` (SSR 호환)
- Nuxt UI 컴포넌트는 `app.config.ts`의 `Dd` prefix 사용
- 스타일: Tailwind CSS 4 + SCSS (`app/assets/`)

### SSR/CSR 경계

- 클라이언트 전용 코드: `import.meta.client` 가드 또는 `.client.vue` suffix 사용
- `useAppSeo` 내에서 `window` / `isPwa` 직접 참조 금지 (SSR 오류)
- `@vercel/analytics` 등은 `@vercel/*/vue` import 사용 (node-server preview 호환)

### i18n

- locale 파일: `i18n/locales/ko.ts`, `i18n/locales/en.ts`
- 키 추가·수정 시 **ko.ts / en.ts 동시 반영** 필수
- SEO 메타: `i18n/locales` `seo.*` 키 + `usePageSeo()` 사용

### 커밋 컨벤션

형식: `<prefix>: <메시지>` (메시지는 한글)

| Prefix | 설명 |
|--------|------|
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `modify` | 기존 기능 추가·변경 |
| `refactor` | 코드 개선 (동작 변경 없음) |
| `style` | 포맷 변경 (코드 수정 없음) |
| `chore` | 빌드·패키지 수정 |
| `docs` | 문서 수정 |
| `remove` | 파일·코드 삭제 |
| `rename` | 파일·코드명 변경 |

예: `feat: AI 채팅 스트리밍 구현`, `fix: 날씨 위젯 좌표 오류 수정`

---

## 임베딩 업데이트

`resume` 스키마 데이터(profile, experience, skills, projects 등)가 변경되면 **반드시** `initialize-embeddings` Edge Function을 다시 invoke 해야 합니다.

- Supabase Dashboard → Functions → `initialize-embeddings` → Invoke function

벡터 검색이 최신 데이터를 반영하려면 임베딩이 최신 상태여야 합니다.

---

## SEO / AEO

- **Index**: `/`, `/ai`
- **Noindex**: `/ai/components` — `definePageMeta({ robots: 'noindex, nofollow' })`
- `public/_robots.txt` 사용 금지 — `@nuxtjs/robots` 단일 소스
- canonical·OG URL: `useSiteConfig().url` + `route.path` (절대 URL)
- SEO 관련 작업 시 `.claude/rules/seo-nuxt.md` 참고

---

## 브랜치 워크플로

```
feature/* → develop → main
```

- PR은 항상 `develop`을 base로 생성합니다.
