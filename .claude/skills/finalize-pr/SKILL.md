---
name: finalize-pr
description: >
  Git 브랜치 작업 완료 후 커밋, push, GitHub PR 생성/업데이트를 자동화하는 skill.
  gh CLI를 사용하여 GitHub과 직접 통신한다.
  커밋 컨벤션(.claude/rules/commit-convention.md)을 따르고,
  AS-IS/TO-BE 비교 구조의 PR description을 생성한다.
  Use when: (1) 작업 완료 후 커밋+push+PR 한번에 처리, (2) PR 내용 작성/업데이트,
  (3) "PR 만들어", "push하고 PR 작성해", "커밋하고 PR 올려줘" 등의 요청.
  Triggers: PR, pull request, 커밋하고 push, PR 만들어, PR 작성, finalize, ship,
  push하고 PR, 커밋하고 PR, PR 올려, PR 생성, PR 업데이트
---

# Finalize PR

gh CLI 기반으로 커밋 → push → GitHub PR 생성/업데이트를 수행한다.

## Prerequisites

- `gh` CLI 설치 및 인증 완료 (`gh auth status`)
- feature 브랜치에서 작업 중 (`develop`/`main`에서 직접 작업 금지)

## Workflow

### Step 1: 상태 수집

```bash
git status
git branch --show-current
git remote get-url origin
gh auth status
```

**base branch: 항상 `develop`** (`.claude/rules/branch-workflow.md` 참고)

```bash
git fetch origin develop --quiet
git log origin/develop..HEAD --oneline
git diff --stat origin/develop..HEAD
```

### Step 2: 커밋

uncommitted 변경이 없으면 Step 3으로 건너뛴다.

**컨벤션**: `.claude/rules/commit-convention.md` 따름

- `@.claude/commands/commit.md` 절차(typecheck + lint) 실행
- HEREDOC으로 커밋 메시지 전달
- 사용자에게 커밋 메시지 확인 후 실행

### Step 3: Push

```bash
git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null \
  && git push \
  || git push -u origin $(git branch --show-current)
```

### Step 4: PR 확인/생성

```bash
gh pr list --head "$(git branch --show-current)" --base develop --state open
```

- **PR 존재**: 번호 저장, Step 5에서 body 업데이트
- **PR 없음**: Step 5 작성 후 생성

```bash
gh pr create --base develop --title "{제목}" --body "{description}"
```

### Step 5: PR Description

`origin/develop` 기준 AS-IS/TO-BE 구조:

```markdown
## Summary
{1-3줄 요약}

---

### AS-IS (변경 전)
{develop 기준 기존 동작}

### TO-BE (변경 후)
{이 PR 적용 후 동작}

### 주요 변경사항
{bullet}

### 변경 규모
- **{N}개 파일** | **+{N}줄** | **-{N}줄**
```

Before 코드 추출:

```bash
git show develop:app/path/to/file.vue
```

### Step 6: 결과 보고

- PR URL
- 변경 요약, 커밋 수
- base branch `develop` 확인

## Error Handling

- **gh 미설치/미인증**: `brew install gh && gh auth login` 안내
- **push 실패**: `git pull --rebase origin develop` 제안
- **develop에 없는 feature 브랜치**: push -u 후 PR 생성
