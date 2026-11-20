import type { H3Event } from 'h3'

// translate-resume Edge Function 이 번역을 지원하는 resume 테이블
export type ResumeTranslatableTable
  = | 'profile'
    | 'experience'
    | 'education'
    | 'certifications'
    | 'projects'
    | 'skills'
    | 'hobbies'
    | 'image_archive'
    | 'threejs'

type TranslationMap = Record<string, Record<string, unknown>>

const SOURCE_LANGUAGE = 'ko'
const LANG_PATTERN = /^[a-z]{2}$/

/**
 * 쿼리스트링 `lang` 을 정규화한다. 원본 언어(ko)이거나 형식이 맞지 않으면 null (번역 불필요)
 * 실제 지원 언어 검증은 Edge Function(_shared/language.ts)이 수행한다.
 */
export const getResumeLang = (event: H3Event): string | null => {
  const raw = getQuery(event).lang
  const lang = typeof raw === 'string' ? raw.toLowerCase() : ''
  return LANG_PATTERN.test(lang) && lang !== SOURCE_LANGUAGE ? lang : null
}

const fetchTranslations = async (table: ResumeTranslatableTable, lang: string): Promise<TranslationMap> => {
  const config = useRuntimeConfig()
  const response = await $fetch<{ translations?: TranslationMap }>(
    `${config.supabaseUrl}/functions/v1/translate-resume`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.supabaseKey}` },
      body: { table, lang },
    },
  )
  return response.translations ?? {}
}

/**
 * resume 행 목록에 요청 언어 번역을 덮어쓴다.
 * - 원본(한국어) 요청이면 그대로 반환
 * - 번역 실패 시 원본을 반환 (컴포넌트는 한국어로라도 표시)
 */
export const localizeResumeRows = async <T extends { id: string }>(
  event: H3Event,
  table: ResumeTranslatableTable,
  rows: T[],
): Promise<T[]> => {
  const lang = getResumeLang(event)
  if (!lang || rows.length === 0) return rows

  try {
    const translations = await fetchTranslations(table, lang)
    return rows.map(row => ({ ...row, ...(translations[row.id] ?? {}) }) as T)
  }
  catch (error) {
    console.error(`[resumeTranslation] ${table}/${lang} failed, fallback to source:`, error)
    return rows
  }
}

export const localizeResumeRow = async <T extends { id: string }>(
  event: H3Event,
  table: ResumeTranslatableTable,
  row: T | null,
): Promise<T | null> => {
  if (!row) return row
  const [localized] = await localizeResumeRows(event, table, [row])
  return localized ?? row
}
