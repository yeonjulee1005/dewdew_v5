---
description: 운영 배포 후 develop 브랜치를 origin/main와 동기화
---

`.claude/skills/sync-develop-after-release/SKILL.md` 절차를 실행한다.

1. Preflight — rebase/merge 중단, `git fetch origin --prune`, tree diff 확인
2. tree diff 비어 있으면 reset + `--force-with-lease` push
3. Verification — main/develop tree 해시 일치 확인
4. (선택) merged `feature/*` 브랜치 정리 — `gh pr list --state merged` 후보 목록 → **사용자 확인** → remote delete + prune
5. force push·remote branch delete 전 사용자에게 영향 안내

**금지**: `git rebase origin/main`, `--force` (without-lease), 브랜치명 하드코딩 삭제
