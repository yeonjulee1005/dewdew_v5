---
name: finalize-pr
description: >
  커밋 → push → GitHub PR(develop base) 생성/업데이트 자동화.
  "PR 만들어", "push하고 PR 작성", "커밋하고 PR 올려줘" 요청 시 사용.
---

# Finalize PR

`.cursor/commands/commit.md` → `.cursor/commands/push.md` → PR body 자동 작성 순서로 실행.

- base branch: **develop** (`.cursor/rules/branch-workflow.mdc`)
- CLI: **gh** (`gh auth status` 필수)
- feature 브랜치에서만 실행
- 커밋 컨벤션: `.cursor/rules/commit-convention.mdc`
- PR description: develop 기준 AS-IS/TO-BE 구조

상세 절차: `.claude/skills/finalize-pr/SKILL.md` 참고 (동일 워크플로)
