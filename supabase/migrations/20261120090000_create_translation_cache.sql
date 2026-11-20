-- 2026-11-20 AI 채팅 다이나믹 컴포넌트 다국어 표시: 번역 캐시 테이블
-- resume.* 원본(한국어)은 그대로 두고, translate-resume Edge Function이 (테이블, 언어) 단위로 번역 결과를 캐싱한다.
-- source_hash 가 원본 데이터 해시와 다르면 Edge Function이 다시 번역해 덮어쓴다 (수동 무효화 불필요).
-- 접근: RLS 활성화 + 정책 없음 → anon/authenticated 접근 불가, service role(Edge Function)만 읽기·쓰기.

begin;

create table if not exists resume.translation_cache (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  lang text not null,
  source_hash text not null,
  translations jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint translation_cache_table_lang_key unique (table_name, lang)
);

comment on table resume.translation_cache is 'resume.* 다국어 번역 캐시 (translate-resume Edge Function 전용)';
comment on column resume.translation_cache.translations is '{ [row id]: { [field]: 번역값 } }';

alter table resume.translation_cache enable row level security;

commit;
