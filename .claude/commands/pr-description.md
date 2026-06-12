---
description: "GitHub PR 변경사항 분석 후 description 자동 생성·등록"
allowed-tools: ["Read", "Bash"]
---

GitHub PR의 description(body)을 변경사항 분석 기반으로 자동 생성·등록합니다.

## 사용법

- `/pr-description` — 현재 브랜치에 연결된 열린 PR(`develop` base)을 찾아 description 자동 업데이트
- `/pr-description <PR번호>` — 특정 PR description 자동 업데이트
- `/pr-description --dry-run` — 등록하지 않고 채팅에 초안만 출력

## 실행 절차

### 1. 사전 검사

- `command -v gh` 확인 → 없으면 `brew install gh && gh auth login` 안내 후 종료
- `gh auth status` 확인 → 미인증이면 "`gh auth login`이 필요합니다." 안내 후 종료

### 2. 대상 PR 결정

- 인자가 숫자(`^[0-9]+$`)면 → 그 번호를 PR 번호로 사용
- 인자가 비어 있거나 `--dry-run`만 있으면:
  ```bash
  gh pr list --head "$(git branch --show-current)" --base develop --state open --json number,url
  ```
  - PR이 없으면 "현재 브랜치에 develop 대상 열린 PR이 없습니다. 먼저 `/push`로 PR을 생성하거나 PR 번호를 인자로 전달해주세요." 안내 후 종료

### 3. 변경사항 분석

diff base는 **PR의 실제 base branch** (`develop` 기대). `main` 하드코딩 금지.

```bash
TARGET=$(gh pr view <PR번호> --json baseRefName -q .baseRefName)
git fetch origin "$TARGET" --quiet
git log "origin/$TARGET..HEAD" --oneline
git diff --stat "origin/$TARGET...HEAD"
git diff "origin/$TARGET...HEAD"
```

파일 유형별 분류:

- `.vue`, `.ts` — 컴포넌트/composable/페이지 변경
- `nuxt.config.ts`, `app.config.ts` — Nuxt 설정
- `i18n/locales/*.json` — i18n 변경
- `package.json`, `bun.lock` — 의존성 변경
- `server/**` — Nitro API/미들웨어
- `*.test.ts`, `*.spec.ts` — 테스트

### 4. Description 생성 (한국어)

```markdown
## 변경사항
- [커밋 메시지·diff 분석을 통해 추론한 주요 변경사항을 bullet로 정리]

## 관련 이슈
- (수동 입력 필요)

## 테스트 방법
- [ ] [변경된 영역 기준 검증 단계 — Nuxt dev/build/preview 포함]

## 스크린샷 (선택)


## 체크리스트
- [ ] `bunx nuxi typecheck` 통과
- [ ] `bun run lint` 통과
- [ ] `bunx stylelint "**/*.{vue,css,scss}"` 통과
- [ ] i18n ko/en 키 동기화 확인
- [ ] 셀프 코드리뷰 완료
```

### 5. 적용

- `--dry-run`이 있으면 → 채팅에 마크다운만 출력 후 종료
- 그렇지 않으면:
  ```bash
  gh pr edit <PR번호> --body-file -
  ```
  (HEREDOC으로 body 전달)

### 6. 품질 체크

- 본문이 한국어로 작성됐는지
- 변경된 영역이 빠짐없이 반영됐는지
- base branch가 `develop`인지

---

$ARGUMENTS
