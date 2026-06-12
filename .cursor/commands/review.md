---
description: develop 대비 또는 PR 번호 기준 코드 리뷰 (선택적 PR 댓글 등록)
---

GitHub PR·브랜치·파일 단위 코드 리뷰.

## 사용법

- `/review` — `origin/develop` 대비 로컬 변경
- `/review <PR번호>` — PR diff 리뷰
- `/review <PR번호> --comment` — `gh pr comment`로 등록
- `/review <파일경로>` — 파일 단독

## 리뷰 관점

1. 코드 품질·네이밍
2. Vue 3 / Nuxt 4 (`.cursor/rules/nuxt4-conventions.mdc`)
3. i18n ko/en 동기화
4. SSR·보안·성능
5. Vitest 커버리지

## 출력 (한국어)

개요 / 좋은 부분 / 개선 제안 (`path:line`) / 잠재 이슈 / 결론(승인·수정 필요)

`gh` 미설치 시 `brew install gh && gh auth login` 안내.
