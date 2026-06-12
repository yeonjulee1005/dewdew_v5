---
description: nuxt.config 전역 SEO·AEO 설정 (site, robots, sitemap, schemaOrg, aiReady)
---

`.cursor/skills/seo-optimizer/SKILL.md`로 **전역 설정**을 적용한다.

## 작업

1. `nuxt.config.ts` — `site`, `robots`, `sitemap`, `schemaOrg`, `aiReady`
3. `public/_robots.txt` 삭제 (있을 경우)
4. `nuxt-ai-ready` 미설치 시 `bunx nuxt module add ai-ready`
5. `bun run build` 후 `/robots.txt`, `/sitemap.xml`, `/llms.txt` 확인

기준: `.cursor/rules/seo-nuxt.mdc`
