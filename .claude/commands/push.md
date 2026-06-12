현재 feature 브랜치를 원격에 push하고 **develop** 대상 PR description을 자동 생성합니다.

## Preflight

- 현재 브랜치가 `develop` 또는 `main`이면 중단하고 feature 브랜치 생성을 안내한다.
- `command -v gh` 확인 → 없으면 `brew install gh && gh auth login` 안내 후 종료

## 실행 절차

### 1. 타겟 브랜치

**항상 `develop`** 을 사용한다. (`main`/`main` fallback 금지)

```bash
git fetch origin develop --quiet
TARGET=develop
```

- `origin/develop`이 없으면 중단하고 안내:
  > "`develop` 브랜치가 원격에 없습니다. develop 브랜치를 먼저 push한 뒤 다시 시도해주세요."

### 2. 기존 PR 확인

```bash
CURRENT=$(git branch --show-current)
gh pr list --head "$CURRENT" --base develop --state open --json number,url
```

- 결과가 있으면 → "기존 PR 업데이트" 분기
- 비어 있으면 → "신규 PR 생성" 분기

### 3. Push

**신규 PR 생성:**

```bash
git push -u origin HEAD
gh pr create --base develop --head "$CURRENT" --fill
```

**기존 PR 업데이트:**

```bash
git push origin HEAD
```

- push 실패 시 원인(권한, 충돌, hook 실패 등)을 사용자에게 안내한다.

### 4. PR description 자동 생성

push가 성공했다면 아래 절차로 PR body를 자동 생성·등록한다. diff base는 `develop`을 사용한다.

@.claude/commands/pr-description.md

## Verification

- PR URL 출력
- base branch가 `develop`인지 확인
