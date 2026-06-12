---
description: typecheck·lint 통과 후 커밋 컨벤션에 맞게 커밋
---

변경사항을 커밋해줘.

1. `bunx nuxi typecheck` → 변경 파일 기준 에러만 수정 후 재실행
2. `bun run lint` → 변경 파일 기준 에러만 수정 후 재실행
3. `.cursor/rules/commit-convention.mdc` 형식으로 커밋 (한글, prefix)
4. 목적이 다르면 분리 커밋
5. `.env`, credentials 커밋 금지

HEREDOC으로 커밋 메시지 전달. 사용자 요청 없이 amend·force push 금지.
