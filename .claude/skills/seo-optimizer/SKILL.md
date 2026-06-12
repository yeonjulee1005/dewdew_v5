---
name: seo-optimizer
description: >
  Nuxt SEO·AEO 감사 및 적용. Robots, Sitemap, Schema.org, AI Ready, useAppSeo.
  "SEO", "AEO", "robots", "sitemap", "schema", "llms.txt", "메타태그", "canonical",
  "noindex", "seo-audit", "seo 적용" 요청 시 사용.
---

# SEO Optimizer

Nuxt 4 + `@nuxtjs/seo` + `nuxt-ai-ready` + bun. `.claude/rules/seo-nuxt.md` 및 `.cursor/rules/seo-nuxt.mdc`를 기준으로 감사·적용한다.

## Workflow

1. **규칙 로드** — `.claude/rules/seo-nuxt.md`
2. **범위 파악** — 전역(`nuxt.config`) / 페이지(`app/pages/**`) / 모듈 단위
3. **AS-IS 스캔**
   - `nuxt.config.ts` — `site`, `robots`, `sitemap`, `schemaOrg`, `aiReady`
   - `app/app.vue`, `app/composables/seo/**`
   - `app/pages/**` — `definePageMeta`, `usePageSeo`
   - `i18n/locales/{ko,en}.json` — `seo.*` 키
   - `public/_robots.txt` 존재 여부 (있으면 Fail)
4. **모듈별 체크리스트** (아래) → Pass/Fail 리포트 또는 TO-BE diff
5. **검증** — `bun run build` → `/robots.txt`, `/sitemap.xml`, `/llms.txt` 확인
6. **품질** — `bunx nuxi typecheck` + `bun run lint`

## 모듈별 체크리스트

### Robots
- [ ] `public/_robots.txt` 없음
- [ ] `robots.disallow`에 `/testing` 포함
- [ ] non-production 색인 차단 (Nuxt SEO env 기본값)

### Sitemap
- [ ] `sitemap.exclude`에 `/testing`
- [ ] `/` priority 1.0, `/guide` 0.9

### SEO Utils
- [ ] `site.url`, `site.name`, `site.description`, `site.defaultLocale`
- [ ] `charset: utf-8`
- [ ] canonical·ogUrl 절대 URL
- [ ] manual canonical 중복 없음 (`useAppSeo` 단일 소스)
- [ ] `html lang` = `locale.value`

### Schema.org
- [ ] `defineWebSite` + `defineOrganization` 전역
- [ ] 홈: `defineWebApplication`
- [ ] guide: FAQ 후보 검토

### AI Ready
- [ ] `nuxt-ai-ready` 설치
- [ ] `aiReady` 설정, `/llms.txt` 응답

### 앱 WebView
- [ ] SEO·Schema 항상 적용 (`isApp` 분기 없음)
- [ ] AdSense만 `!userAgent.includes('APP_Monitors')`
- [ ] `useAppSeo`에서 `window` 미사용

### i18n
- [ ] `seo.index`, `seo.guide`, `seo.testing` ko/en 동기화

## 커맨드 매핑

| 커맨드 | 단계 |
|--------|------|
| `/seo-audit` | 1~4, 리포트만 |
| `/seo-page` | 3~4, 특정 페이지 |
| `/seo-config` | 3~4, nuxt.config·모듈 |
| `/seo-apply` | 1~6 전체 |

## 출력 (한국어)

감사 시: 개요 / 모듈별 Pass·Fail / 우선순위(P0~P2) / 권장 조치

적용 시: 변경 파일 목록 / AS-IS·TO-BE 요약 / 검증 결과
