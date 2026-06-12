---
description: 'GitHub PR 리뷰 코멘트 분석 후 선택한 항목만 코드에 반영'
allowed-tools: ['Read', 'Edit', 'MultiEdit', 'Grep', 'Glob', 'Bash']
---

GitHub PR의 리뷰 코멘트를 모아 분석하고, 사용자가 선택한 항목만 코드에 반영합니다.

## 사용법

- `/pr-review-apply <PR번호>` — PR 리뷰 코멘트를 분석하고 번호 매겨 나열
- `/pr-review-apply <PR번호> <코멘트번호>` — 특정 코멘트만 반영 (예: `1`, `1,3,5`)

## 실행 절차

### 1. 사전 검사

- `command -v gh` 확인 → 없으면 안내 후 종료
- `gh auth status` 확인 → 미인증이면 "`gh auth login`이 필요합니다." 안내 후 종료
- 인자에서 첫 토큰을 PR 번호로 받음. `^[0-9]+$`가 아니면 사용법 안내 후 종료

### 2. 모드 결정

- **Phase 1** — PR 번호만 있음 → 분석·리스팅
- **Phase 2** — 추가 토큰이 코멘트 번호 → 반영 계획·승인·적용

### 3. Phase 1 — PR 리뷰 코멘트 분석

#### 3.1 데이터 수집

```bash
gh pr view <PR번호> --json title,body,comments,reviews
gh pr diff <PR번호>
gh api repos/{owner}/{repo}/pulls/<PR번호>/comments
gh api repos/{owner}/{repo}/pulls/<PR번호>/reviews
```

#### 3.2 필터링 규칙

**제외**: LGTM, 👍, 감사 인사, resolved thread, 질문만 있고 변경 요청 없는 코멘트

**포함**: 코드 변경 요청, 버그·보안·성능 우려, 컨벤션 위반

#### 3.3 출력 포맷 (한국어)

```markdown
## PR #<번호> 리뷰 코멘트 분석 결과

총 N개의 반영 가능한 코멘트를 발견했습니다.

### [1] <우선순위> — `app/path/to/file.vue:42`

- **리뷰어**: @<username>
- **내용**: <코멘트 본문 요약>
- **반영 권장**: 예/아니오 — <이유>
```

마지막에: `반영할 코멘트 번호를 알려주세요. 예: "1" 또는 "1,3,5"`

### 4. Phase 2 — 코멘트 반영

각 코멘트마다 Before/After 계획 제시 → 사용자 승인 후 `Edit` 적용

#### 4.3 검증

```bash
bunx nuxi typecheck
bun run lint
```

- 변경 파일에서 새 에러가 발생하면 수정 후 재실행 (`/commit` 룰과 동일)

#### 4.4 결과 보고

반영 완료 표 + "커밋은 별도로 `/commit`을 호출하세요."

## 5. 컨벤션 준수

- 출력은 모두 한국어
- `.claude/rules/nuxt4-conventions.md` 준수
- Vue SFC 예시는 `<script setup lang="ts">` 형식 사용

---

$ARGUMENTS
