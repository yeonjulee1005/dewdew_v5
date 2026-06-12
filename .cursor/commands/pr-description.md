---
description: PR diff 분석 후 body 자동 생성·등록 (develop base)
---

GitHub PR description(body) 자동 생성·등록.

## 사용법

- `/pr-description` — 현재 브랜치의 develop 대상 열린 PR
- `/pr-description <PR번호>`
- `/pr-description --dry-run` — 초안만 출력

## 절차

1. `gh auth status` 확인
2. `TARGET=$(gh pr view <번호> -q .baseRefName)` — 기대값 `develop`
3. `git diff origin/$TARGET...HEAD` 분석
4. 한국어 template 작성 (변경사항, 테스트 방법, 체크리스트)
5. `gh pr edit <번호> --body-file -` (dry-run 제외)

## 체크리스트 (PR body에 포함)

- [ ] `bunx nuxi typecheck` 통과
- [ ] `bun run lint` 통과
- [ ] `bunx stylelint "**/*.{vue,css,scss}"` 통과
- [ ] i18n ko/en 키 동기화 확인
- [ ] 셀프 코드리뷰 완료
