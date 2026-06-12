---
description: feature 브랜치 push 후 develop 대상 PR 생성·description 자동 작성
---

현재 feature 브랜치를 push하고 **develop** 대상 PR을 생성·업데이트한다.

## Preflight

- `develop`/`main` 브랜치면 중단 → feature 브랜치 안내
- `gh auth status` 확인

## 절차

1. `TARGET=develop`, `git fetch origin develop`
2. 기존 PR: `gh pr list --head "$(git branch --show-current)" --base develop --state open`
3. Push: `git push -u origin HEAD` (또는 `git push`)
4. 신규: `gh pr create --base develop --fill`
5. PR body: `.cursor/commands/pr-description.md` 절차로 자동 생성

Verification: PR URL 출력, base=`develop` 확인
