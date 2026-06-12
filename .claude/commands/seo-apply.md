---
description: SEO·AEO 감사 후 일괄 적용 (config + composable + pages + i18n)
---

`.claude/skills/seo-optimizer/SKILL.md` **전체 워크플로(1~6)** 실행.

## 순서

1. `/seo-audit` 수준 감사
2. `/seo-config` 전역 설정
3. `useAppSeo` · `app.vue` 리팩터
4. `/seo-page` 모든 페이지
5. `bun run build` + typecheck + lint
6. 산출물 검증 리포트

커밋은 사용자 요청 시에만. 기준: `.claude/rules/seo-nuxt.md`
