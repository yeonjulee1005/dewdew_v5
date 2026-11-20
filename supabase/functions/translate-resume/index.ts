// translate-resume — resume.* 한국어 원본을 요청 언어로 번역해 반환 (캐시 우선)
//
// 요청: POST { table: 'experience', lang: 'en' }
// 응답: { lang, cached, translations: { [row id]: { [field]: 번역값 } } }
//
// - 원본은 이 함수가 직접 조회한다 (클라이언트가 보낸 텍스트는 번역하지 않음 → 임의 번역 남용 방지)
// - 캐시: resume.translation_cache (table_name, lang) 1행. source_hash 불일치 시 재번역 후 덮어쓰기
// - 번역 대상은 TRANSLATABLE_FIELDS 에 정의된 텍스트 필드만. URL·날짜·수치·기술명은 건드리지 않는다

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { getSupabaseClient } from '../_shared/supabase.ts'
import { createAICompletion } from '../_shared/ai-provider.ts'
import { DEFAULT_MODEL_ID } from '../_shared/ai-models.ts'
import { SOURCE_LANGUAGE, SUPPORTED_LANGUAGES, isSupportedLanguage } from '../_shared/language.ts'
import type { LanguageCode } from '../_shared/language.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// 프롬프트·필드 구성이 바뀌면 올려서 기존 캐시를 무효화한다
const TRANSLATION_VERSION = 'v1'
const BATCH_SIZE = 8

const TRANSLATABLE_FIELDS = {
  profile: ['full_name', 'title', 'location', 'bio', 'detailed_bio', 'weaknesses', 'ai_personality_data'],
  experience: ['company_name', 'position', 'description', 'location'],
  education: ['school_name', 'degree', 'major', 'description'],
  certifications: ['title', 'issuer', 'description'],
  projects: ['title', 'description', 'highlights'],
  skills: ['category'],
  hobbies: ['title', 'description'],
  image_archive: ['title', 'season', 'category', 'year_description', 'tags'],
  threejs: ['title', 'description'],
} as const satisfies Record<string, readonly string[]>

type TranslatableTable = keyof typeof TRANSLATABLE_FIELDS
// 문자열 · 문자열 배열 · 중첩 JSON(jsonb) 모두 허용. 번역은 문자열 leaf 에만 적용된다
type FieldValue = string | FieldValue[] | { [key: string]: FieldValue } | number | boolean | null
type RowFields = Record<string, FieldValue>
type TranslationMap = Record<string, RowFields>

const isTranslatableTable = (table: unknown): table is TranslatableTable =>
  typeof table === 'string' && Object.prototype.hasOwnProperty.call(TRANSLATABLE_FIELDS, table)

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

const sha256 = async (text: string): Promise<string> => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('')
}

// 원본 행 → 번역 대상 필드만 추린 맵 (null·빈 값 제외)
const loadSource = async (table: TranslatableTable): Promise<TranslationMap> => {
  const fields = TRANSLATABLE_FIELDS[table]
  const { data, error } = await getSupabaseClient()
    .schema('resume')
    .from(table)
    .select(['id', ...fields].join(', '))
    .order('id', { ascending: true })

  if (error) throw new Error(`Failed to load resume.${table}: ${error.message}`)

  const source: TranslationMap = {}
  for (const row of (data ?? []) as unknown as Array<Record<string, unknown>>) {
    const picked: RowFields = {}
    for (const field of fields) {
      let value = row[field] as FieldValue | undefined
      // jsonb 가 문자열로 저장된 경우 객체로 풀어서 구조를 보존한다
      if (typeof value === 'string' && /^\s*[{[]/.test(value)) {
        try {
          value = JSON.parse(value)
        }
        catch {
          // 일반 문자열로 취급
        }
      }
      if (typeof value === 'string' && value.trim()) picked[field] = value
      else if (Array.isArray(value) && value.length > 0) picked[field] = value
      else if (value && typeof value === 'object' && Object.keys(value).length > 0) picked[field] = value
    }
    if (Object.keys(picked).length > 0) source[String(row.id)] = picked
  }
  return source
}

const parseJsonObject = (text: string): Record<string, unknown> => {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end <= start) throw new Error('No JSON object in model output')
  return JSON.parse(text.slice(start, end + 1))
}

const buildSystemPrompt = (lang: LanguageCode) => `You translate portfolio/resume data of a Korean software engineer from Korean into ${SUPPORTED_LANGUAGES[lang]}.

Input: a JSON object { "<row id>": { "<field>": value } } where a value may be a string, an array, or a nested object.
Output: ONLY a JSON object with exactly the same structure (same ids, keys, nesting and array lengths). Translate string values only; never translate object keys; keep numbers and booleans unchanged. No markdown, no commentary.

Rules:
- Translate naturally for a professional portfolio, keeping the original meaning and tone. Do not add or omit information.
- Keep technology, product, framework and library names as-is (e.g. Nuxt, Supabase, Three.js).
- Company, school and personal names: use the official ${SUPPORTED_LANGUAGES[lang]} name if one is widely known, otherwise romanize/transliterate. You may keep the original in parentheses only when helpful.
- Keep line breaks, list markers, numbers, dates, URLs and emoji unchanged.
- If a value is already in ${SUPPORTED_LANGUAGES[lang]}, return it unchanged.`

const UNMATCHED = Symbol('unmatched')

// 번역값을 원본 구조에 맞춰 검증한다. 구조가 어긋난 지점은 원문으로 폴백
const matchStructure = (original: FieldValue, translated: unknown): FieldValue | typeof UNMATCHED => {
  if (typeof original === 'string') {
    return typeof translated === 'string' && translated.trim() ? translated : UNMATCHED
  }
  if (Array.isArray(original)) {
    if (!Array.isArray(translated) || translated.length !== original.length) return UNMATCHED
    return original.map((item, i) => {
      const matched = matchStructure(item, translated[i])
      return matched === UNMATCHED ? item : matched
    })
  }
  if (original && typeof original === 'object') {
    if (!translated || typeof translated !== 'object' || Array.isArray(translated)) return UNMATCHED
    const result: Record<string, FieldValue> = {}
    for (const [key, item] of Object.entries(original)) {
      const matched = matchStructure(item, (translated as Record<string, unknown>)[key])
      result[key] = matched === UNMATCHED ? item : matched
    }
    return result
  }
  return original
}

// 모델 출력이 원본 구조와 다르면 해당 필드는 버린다 (원문으로 폴백)
const sanitize = (source: TranslationMap, output: Record<string, unknown>): TranslationMap => {
  const result: TranslationMap = {}
  for (const [id, fields] of Object.entries(source)) {
    const translatedRow = output[id]
    if (!translatedRow || typeof translatedRow !== 'object') continue
    const row: RowFields = {}
    for (const [field, original] of Object.entries(fields)) {
      const matched = matchStructure(original, (translatedRow as Record<string, unknown>)[field])
      if (matched !== UNMATCHED) row[field] = matched
    }
    if (Object.keys(row).length > 0) result[id] = row
  }
  return result
}

const translateBatch = async (batch: TranslationMap, lang: LanguageCode): Promise<TranslationMap> => {
  const output = await createAICompletion(
    DEFAULT_MODEL_ID,
    [{ role: 'user', content: JSON.stringify(batch) }],
    buildSystemPrompt(lang),
    { maxTokens: 8000, tag: 'translate-resume' },
  )
  return sanitize(batch, parseJsonObject(output))
}

const translateAll = async (source: TranslationMap, lang: LanguageCode): Promise<TranslationMap> => {
  const entries = Object.entries(source)
  const batches: TranslationMap[] = []
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    batches.push(Object.fromEntries(entries.slice(i, i + BATCH_SIZE)))
  }
  const results = await Promise.all(batches.map(batch => translateBatch(batch, lang)))
  return Object.assign({}, ...results)
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  try {
    const { table, lang } = await req.json().catch(() => ({}))

    if (!isTranslatableTable(table)) return json({ error: 'Unsupported table' }, 400)
    if (!isSupportedLanguage(lang)) return json({ error: 'Unsupported language' }, 400)
    if (lang === SOURCE_LANGUAGE) return json({ lang, cached: true, translations: {} })

    const supabase = getSupabaseClient()
    const source = await loadSource(table)
    const sourceHash = await sha256(`${TRANSLATION_VERSION}:${JSON.stringify(source)}`)

    const { data: cache, error: cacheError } = await supabase
      .schema('resume')
      .from('translation_cache')
      .select('source_hash, translations')
      .eq('table_name', table)
      .eq('lang', lang)
      .maybeSingle()

    if (cacheError) console.error('[translate-resume] cache read failed:', cacheError.message)

    if (cache && cache.source_hash === sourceHash) {
      return json({ lang, cached: true, translations: cache.translations })
    }

    const translations = await translateAll(source, lang)

    const { error: upsertError } = await supabase
      .schema('resume')
      .from('translation_cache')
      .upsert(
        {
          table_name: table,
          lang,
          source_hash: sourceHash,
          translations,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'table_name,lang' },
      )

    if (upsertError) console.error('[translate-resume] cache write failed:', upsertError.message)

    return json({ lang, cached: false, translations })
  }
  catch (error) {
    console.error('[translate-resume] error:', error)
    return json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
  }
})
