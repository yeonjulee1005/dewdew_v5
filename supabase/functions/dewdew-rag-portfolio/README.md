## Dewdew RAG Portfolio 함수 구조

```bash
supabase/
├── config.toml                    # Supabase 설정
├── functions/
│   ├── _shared/                   # 공유 모듈 (배포 안됨, import용)
│   │   ├── types.ts              # 타입 정의
│   │   ├── supabase.ts           # Supabase 클라이언트
│   │   ├── openai.ts             # OpenAI 클라이언트
│   │   ├── rag.ts                # RAG 로직
│   │   └── component-mapper.ts   # 컴포넌트 매핑
│   │
│   └── chat/                      # /chat 엔드포인트로 배포됨
│       └── index.ts
│
└── migrations/                    # DB 마이그레이션 (스키마 SQL)
    └── 20241124_init_resume_schema.sql
```

## Edge Functions Command

```bash
  // deployment
  supabase functions deploy dewdew-rag-portfolio --project-ref tgtlrqqasaiavynmlxkc

  // secrets
  supabase secrets set OPENAI_API_KEY=
```