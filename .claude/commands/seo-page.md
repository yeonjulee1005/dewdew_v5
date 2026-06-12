---
description: 특정 페이지 SEO 적용 (definePageMeta, i18n seo.*, schema, noindex)
---

`.claude/skills/seo-optimizer/SKILL.md`로 **지정 페이지** SEO를 적용한다.

## 사용법

- `/seo-page` — 전체 페이지 점검
- `/seo-page app/pages/guide.vue` — 단일 파일

## 작업

1. `i18n/locales/ko.json` · `en.json`에 `seo.{page}` 키 추가·동기화
2. `usePageSeo('index' | 'guide' | 'testing')` 또는 페이지별 schema
3. `/testing` → `robots: 'noindex, nofollow'`
4. `bunx nuxi typecheck` + `bun run lint`
