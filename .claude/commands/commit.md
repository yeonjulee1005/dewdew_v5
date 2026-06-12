변경사항을 커밋해줘.

## Preflight

- 현재 브랜치가 `develop` 또는 `main`이면 커밋 전 feature 브랜치에서 작업 중인지 확인한다.

## 실행 절차

1. `bunx nuxi typecheck` 실행 → 에러 발생 시 `git diff --name-only`로 변경된 파일 목록을 확인하고, 변경된 파일에서 발생한 에러만 수정. 변경 파일에 새 에러가 있으면 수정 후 재실행
2. `bun run lint` 실행 → 실패 시 `git diff --name-only`로 변경된 파일 목록을 확인하고, 변경된 파일에서 발생한 에러만 수정. 변경 파일에 새 에러가 있으면 수정 후 재실행
3. 모두 통과하면 `.claude/rules/commit-convention.md`의 커밋 컨벤션에 맞게 커밋
4. 변경사항이 여러 목적(기능 추가, 버그 수정, 리팩토링 등)에 걸쳐 있으면 관련 파일끼리 묶어서 분리 커밋
5. `.env`, credentials, `.cursor/mcp.json` 등 시크릿 파일은 커밋하지 않는다

## 커밋 메시지

- HEREDOC으로 전달
- 사용자가 명시적으로 요청하지 않으면 amend·force push 금지
