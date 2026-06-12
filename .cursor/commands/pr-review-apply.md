---
description: PR 리뷰 코멘트 분석 후 선택 항목만 코드 반영
---

GitHub PR 리뷰 코멘트를 분석하고 선택한 항목만 반영.

## 사용법

- `/pr-review-apply <PR번호>` — 코멘트 번호 매겨 나열
- `/pr-review-apply <PR번호> 1,3,5` — 선택 반영

## 절차

1. `gh pr view`, `gh pr diff`, review comments API 수집
2. LGTM·resolved 제외, 변경 요청만 필터
3. Phase 1: 번호 목록 출력 → 사용자 선택 대기
4. Phase 2: Before/After 계획 → 승인 → Edit
5. `bunx nuxi typecheck` + `bun run lint`
6. 커밋은 `/commit` 별도 호출

Vue SFC는 `<script setup lang="ts">` 형식. `.cursor/rules/nuxt4-conventions.mdc` 준수.
