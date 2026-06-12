---
name: sync-develop-after-release
description: >
  운영 배포(develop → main) 이후 develop 브랜치를 origin/main와 동일하게
  최신화한다. reset --hard + force-with-lease push, prune, (선택) merged
  feature 브랜치 정리. rebase origin/main는 사용하지 않는다.
  Use when: 운영 배포 후 develop 동기화, develop 최신화, main 반영 develop,
  develop reset main, 배포 후 develop 맞추기, sync develop from main.
---

# Sync Develop After Release

`feature/* → develop → main` 워크플로에서 **main 배포가 끝난 뒤** develop을 main와 같은 코드·기준점으로 맞춘다.

## 왜 rebase가 아닌 reset인가

Develop PR(`Develop #N`)로 main에 머지되면 **코드(tree)는 main에 이미 반영**되지만, develop에는 **원본 feature 커밋 히스토리**가 남는다.

| 방법 | 결과 |
|------|------|
| `git rebase origin/main` | 같은 변경을 다시 적용 → 대량 conflict |
| `git reset --hard origin/main` | tree 동기화, 히스토리 정리 |

`git diff origin/main origin/develop`가 비어 있으면 reset만으로 충분하다.

## Prerequisites

- main 배포(develop → main PR merge) **완료** 확인
- 작업 중인 uncommitted 변경 없음 (있으면 stash 또는 커밋 후 진행)
- `develop`/`main`에서 feature 작업 중이 아님
- remote push 권한 있음
- (브랜치 정리 시) `gh` CLI 인증 완료

## Preflight

```bash
git status
git branch --show-current

# rebase/merge 진행 중이면 먼저 정리
git rebase --abort 2>/dev/null || true
git merge --abort 2>/dev/null || true

git fetch origin --prune
git fetch origin main develop
```

### 배포 반영 확인

```bash
git log origin/develop..origin/main --oneline
git diff origin/main origin/develop --stat
```

- `git diff` **비어 있음** → reset 진행 (일반 케이스)
- `git diff` **있음** → main 배포가 덜 됐거나 develop에만 있는 커밋 존재. **중단**하고 원인 확인

### 안전 확인 (force push 전)

```bash
git log origin/main..origin/develop --oneline
```

목록이 있어도 tree diff가 비어 있으면 **중복 히스토리**일 가능성이 높다.  
tree diff가 있는데 커밋이 develop에만 있으면 **reset 금지** — merge 또는 cherry-pick 검토.

## Workflow

**사용자에게 force push 영향을 한 줄 안내한 뒤** 아래 순서 실행.

```bash
git rebase --abort 2>/dev/null || true
git checkout develop
git fetch origin --prune
git reset --hard origin/main
git push origin develop --force-with-lease
```

### Verification

```bash
git rev-parse origin/main^{tree} origin/develop^{tree}
git log -1 --oneline origin/develop
git log -1 --oneline origin/main
git status
```

## Step 4: 브랜치 정리 (선택, 권장)

develop sync 직후 stale `feature/*` ref를 정리하면 Git Graph가 깔끔해진다.  
**사용자 확인 후** 실행한다. 브랜치명을 하드코딩하지 않는다.

### 왜 `git branch --merged`만으로는 부족한가

Squash merge·Develop PR 배포를 쓰면 feature 커밋 SHA가 main ancestry에 남지 않는다.  
`git branch -r --merged origin/main`에 **안 잡히는 merged 브랜치**가 있다.

→ **`gh pr list --state merged`** 로 후보를 수집한다.

### 후보 수집

```bash
# develop에 merge 완료된 feature PR (최근 30건)
gh pr list --state merged --base develop --limit 30 \
  --json number,headRefName,title,mergedAt \
  --jq '.[] | select(.headRefName | startswith("feature/")) | "\(.number)\t\(.headRefName)\t\(.title)"'

# remote에 아직 ref가 남아 있는 feature 브랜치
git branch -r | grep 'origin/feature/' || true
```

### 사용자 확인

- 후보 목록을 보여주고 **삭제할 브랜치를 확인**받는다.
- 현재 checkout 중인 브랜치·열린 PR 브랜치는 **삭제하지 않는다**.
- 불확실하면 **skip** (안전 우선).

### remote 삭제

```bash
git push origin --delete feature/<name>
```

### local 정리

```bash
git fetch origin --prune

# merged 로컬 feature 브랜치 (존재할 때만)
git branch --merged develop | grep 'feature/' | xargs -r git branch -d
```

`xargs -r`은 macOS 기본 xargs에 없을 수 있다. macOS:

```bash
git branch --merged develop | grep 'feature/' | xargs git branch -d 2>/dev/null || true
```

## Error Handling

| 상황 | 조치 |
|------|------|
| `rebase in progress` | `git rebase --abort` 후 Workflow 재실행 |
| uncommitted changes | stash/commit 후 재실행 |
| `--force-with-lease` rejected | `git fetch origin` 후 remote develop 변경 확인. 팀원이 push했으면 협의 |
| tree diff 비어 있지 않음 | reset 중단. main 배포·develop 미머지 커밋 확인 |
| remote branch delete 실패 | 이미 삭제됐거나 권한 없음 — skip 후 보고 |
| `develop`/`main`에서 feature 작업 요청 | feature 브랜치 생성 안내 (`.cursor/rules/branch-workflow.mdc`) |

## 금지

- `git rebase origin/main` (develop sync 목적)
- `git push --force` (`--force-with-lease` 없이)
- 사용자 확인 없이 force push
- 사용자 확인 없이 remote feature 브랜치 일괄 삭제
- 브랜치명 하드코딩 삭제 (예: `feature/readme-claude-split` 고정)
- `git config` 변경

## 결과 보고

- develop·main tree 해시 일치 여부
- `git push` 성공 여부
- (실행 시) 삭제한 remote/local feature 브랜치 목록
- `git fetch --prune` 실행 여부
- 다음 작업: **갱신된 develop**에서 `feature/<설명>` 브랜치 생성
