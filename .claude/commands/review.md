---
description: "GitHub PR · 브랜치 · 파일 단위 코드 리뷰 (선택적으로 PR 댓글 등록)"
allowed-tools: ["Read", "Grep", "Bash"]
---

GitHub 기반 코드 리뷰를 진행합니다. 결과는 채팅으로 출력하고, 필요 시 GitHub PR 댓글로 자동 등록합니다.

## 사용법

- `/review` — 현재 브랜치 vs `develop` 변경사항을 로컬에서 리뷰 (PR 없어도 동작)
- `/review <PR번호>` — 해당 PR의 변경사항을 리뷰
- `/review <PR번호> --comment` — 리뷰 후 GitHub PR에 댓글로 자동 등록
- `/review <파일경로>` — 특정 파일 단독 리뷰
- `/review --dry-run` — `--comment`와 함께 써도 등록하지 않고 채팅에만 출력

## 실행 절차

### 1. 인자 분석

다음 우선순위로 모드 결정:

1. 토큰에서 `--comment`, `--dry-run` 플래그를 분리
2. 남은 토큰이 `^[0-9]+$` 패턴 → **PR 모드** (해당 번호 사용)
3. 남은 토큰이 파일/디렉터리로 존재 → **파일 모드**
4. 남은 토큰이 비어 있음 → **로컬 브랜치 모드**

`--comment`가 있는데 PR 번호가 결정되지 않으면 다음 안내 후 종료:

> "`--comment`는 PR 번호와 함께만 사용할 수 있습니다. 예: `/review 123 --comment`"

### 2. 사전 검사 (PR 모드 또는 `--comment` 사용 시)

- `command -v gh` 확인 → 없으면 안내 후 종료
  - "`gh`가 설치되어 있지 않습니다. `brew install gh && gh auth login` 실행 후 다시 시도해주세요."
- `gh auth status` 확인 → 미인증이면 "`gh auth login`이 필요합니다." 안내 후 종료

### 3. 변경사항 수집

#### PR 모드

```bash
gh pr view <번호> --json title,body,baseRefName,headRefName,author
gh pr diff <번호>
```

- PR 메타(제목·설명·소스/타겟 브랜치·작성자) 파악
- base가 `develop`이 아니면 경고 표시

#### 로컬 브랜치 모드

```bash
git fetch origin develop --quiet
git log origin/develop..HEAD --oneline
git diff --stat origin/develop...HEAD
git diff origin/develop...HEAD
```

- 변경 내역이 비어 있으면 "현재 브랜치에 `develop` 대비 변경사항이 없습니다." 안내 후 종료

#### 파일 모드

- `Read`로 파일 내용을 그대로 분석

### 4. 리뷰 관점

다음 관점으로 분석한다 (해당 없는 항목은 생략):

1. **코드 품질** — 가독성, 유지보수성, 중복, 네이밍
2. **TypeScript / Vue 3 / Nuxt 4 모범 사례** — `.claude/rules/nuxt4-conventions.md` 참고
3. **프로젝트 컨벤션** — `.claude/rules/` 준수, 한국어 작성, 기존 패턴 재사용
4. **i18n** — `ko.json` / `en.json` 키 동기화
5. **보안** — XSS, 외부 입력 처리, 민감정보·시크릿 노출
6. **성능** — SSR 번들, 불필요한 클라이언트 로직, 이미지 최적화 (`@nuxt/image`)
7. **테스트** — Vitest 커버리지, 테스트 가능성
8. **타입 안정성** — `any` / `as` 남용, 좁히기 누락

### 5. 리뷰 작성 (한국어)

```markdown
## 📋 변경사항 개요
- (주요 변경을 사용자/도메인 관점으로 1~3줄)

## ✅ 좋은 부분
- (잘 된 부분 짚기)

## 🔍 개선 제안
- `파일경로:라인` — 구체 제안 (가능하면 코드 스니펫)

## 🚨 잠재 이슈
- (버그 가능성·리스크·놓친 케이스)

## 🎯 결론
- 승인 / 수정 필요 / 추가 논의 필요 — 이유 한 줄
```

### 6. 출력 / 등록

- `--dry-run`이 있거나 `--comment`가 없으면 → 채팅에만 출력 후 종료
- `--comment`가 있고 PR 번호가 있으면:
  ```bash
  gh pr comment <PR번호> --body "<위에서 작성한 리뷰 마크다운>"
  ```

---

$ARGUMENTS
