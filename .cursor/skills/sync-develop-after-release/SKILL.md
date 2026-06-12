---
name: sync-develop-after-release
description: >
  운영 배포(develop → main) 후 develop을 origin/main와 동기화.
  reset --hard + force-with-lease + prune + (선택) merged feature 브랜치 정리.
  "develop 최신화", "배포 후 develop", "sync develop" 요청 시 사용.
---

# Sync Develop After Release

`.claude/skills/sync-develop-after-release/SKILL.md` 절차를 따른다.

- 워크플로: `feature/* → develop → main`
- **rebase origin/main 금지**
- 슬래시 커맨드: `/sync-develop`

## Quick Workflow

```bash
git rebase --abort 2>/dev/null || true
git checkout develop
git fetch origin --prune
git reset --hard origin/main
git push origin develop --force-with-lease
```

## 브랜치 정리 (선택, 사용자 확인 후)

Squash merge 환경에서는 `git branch --merged`만으로 부족 → `gh pr list --state merged --base develop`으로 `feature/*` 후보 수집 후 삭제.

```bash
git push origin --delete feature/<name>   # 확인받은 브랜치만
git fetch origin --prune
```

브랜치명 하드코딩·일괄 삭제 금지.
