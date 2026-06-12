# 브랜치 워크플로

## 브랜치 구조

```
feature/*  →  develop  →  main
```

| 브랜치 | 용도 |
|--------|------|
| `feature/*` | 기능 개발 (로컬 작업 브랜치) |
| `develop` | 통합·스테이징 |
| `main` | 운영 배포 |

## 로컬 PR 정책

- **로컬에서 PR은 항상 `feature/*` → `develop`**
- `develop` → `main` PR은 릴리즈/배포 담당자가 별도로 생성한다.
- 에이전트가 PR/MR을 생성할 때 `develop`이 아닌 `main`/`main`을 타겟으로 두지 않는다.

## 브랜치 네이밍

- 기능: `feature/<짧은-설명>` (예: `feature/i18n-json-migration`)
- 현재 브랜치가 `develop` 또는 `main`이면 push/PR 명령 실행 전 사용자에게 feature 브랜치 생성을 안내한다.

## diff base

- PR description, 코드 리뷰, 변경 분석의 base는 **`develop`**
- `main`/`main` 하드코딩 금지 (develop → main PR 작성 시에만 예외)
