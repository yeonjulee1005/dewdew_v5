// 사용자 메시지 언어 감지
// - 문자 체계(script)로 판별 가능한 언어는 규칙으로 즉시 결정 (비용 0)
// - 라틴 문자권은 명백한 영어만 규칙으로, 나머지는 짧은 LLM 분류 1회 (수십 토큰)
// 결과는 SUPPORTED_LANGUAGES 코드 중 하나. 번역 캐시 키로도 쓰이므로 허용 목록 밖 코드는 만들지 않는다.

import { createAICompletion } from './ai-provider.ts'
import { DEFAULT_MODEL_ID } from './ai-models.ts'

export const SOURCE_LANGUAGE = 'ko'

export const SUPPORTED_LANGUAGES = {
  ko: 'Korean',
  en: 'English',
  ja: 'Japanese',
  zh: 'Chinese (Simplified)',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  pt: 'Portuguese',
  it: 'Italian',
  nl: 'Dutch',
  pl: 'Polish',
  tr: 'Turkish',
  vi: 'Vietnamese',
  id: 'Indonesian',
  ru: 'Russian',
  th: 'Thai',
  ar: 'Arabic',
  hi: 'Hindi',
} as const

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES

export const isSupportedLanguage = (code: unknown): code is LanguageCode =>
  typeof code === 'string' && Object.prototype.hasOwnProperty.call(SUPPORTED_LANGUAGES, code)

const LATIN_LANGUAGES: LanguageCode[] = ['en', 'es', 'fr', 'de', 'pt', 'it', 'nl', 'pl', 'tr', 'vi', 'id']

const countMatches = (text: string, pattern: RegExp): number => text.match(pattern)?.length ?? 0

// 영어로 확신할 수 있는 흔한 단어 (ASCII 전용 문장에서만 사용)
const ENGLISH_HINT = /\b(the|you|your|what|how|why|who|where|when|is|are|do|did|does|can|could|have|has|i|me|my|about|tell|show|please|hello|hi|hey|thanks)\b/i

type ScriptGuess = LanguageCode | 'latin' | null

const guessByScript = (text: string): ScriptGuess => {
  const counts = {
    hangul: countMatches(text, /\p{Script=Hangul}/gu),
    kana: countMatches(text, /[\p{Script=Hiragana}\p{Script=Katakana}]/gu),
    han: countMatches(text, /\p{Script=Han}/gu),
    cyrillic: countMatches(text, /\p{Script=Cyrillic}/gu),
    thai: countMatches(text, /\p{Script=Thai}/gu),
    arabic: countMatches(text, /\p{Script=Arabic}/gu),
    devanagari: countMatches(text, /\p{Script=Devanagari}/gu),
    latin: countMatches(text, /\p{Script=Latin}/gu),
  }

  const total = Object.values(counts).reduce((sum, n) => sum + n, 0)
  if (total === 0) return null

  // 한글이 조금이라도 의미 있게 섞여 있으면 한국어 (예: "Nuxt4 프로젝트 보여줘")
  if (counts.hangul > 0 && counts.hangul >= counts.kana + counts.han) {
    return counts.hangul >= 2 || counts.latin === 0 ? 'ko' : 'latin'
  }
  if (counts.kana > 0) return 'ja'

  const [dominant] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]!
  switch (dominant) {
    case 'han': return 'zh'
    case 'cyrillic': return 'ru'
    case 'thai': return 'th'
    case 'arabic': return 'ar'
    case 'devanagari': return 'hi'
    case 'latin': return 'latin'
    default: return null
  }
}

const classifyLatinLanguage = async (text: string): Promise<LanguageCode> => {
  // ASCII 전용 + 흔한 영어 단어 → LLM 호출 없이 영어
  if (/^[\x20-\x7E\s]*$/.test(text) && ENGLISH_HINT.test(text)) return 'en'

  try {
    const answer = await createAICompletion(
      DEFAULT_MODEL_ID,
      [{ role: 'user', content: text.slice(0, 500) }],
      `Identify the language of the user's message. Reply with exactly one code from this list and nothing else: ${LATIN_LANGUAGES.join(', ')}. If unsure, reply en.`,
      { maxTokens: 5, tag: 'language-detect' },
    )
    const code = answer.trim().toLowerCase().replace(/[^a-z]/g, '')
    return isSupportedLanguage(code) ? code : 'en'
  }
  catch (error) {
    console.warn('[language] LLM classification failed, fallback to en:', error)
    return 'en'
  }
}

const stripNoise = (text: string): string =>
  text
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/\S+@\S+\.\S+/g, ' ')
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, ' ')

/**
 * 사용자 마지막 메시지의 언어 코드를 반환한다.
 * 판별 불가(이모지·숫자·URL만 있는 경우) → 직전 사용자 메시지 언어 → 그것도 없으면 한국어.
 */
export const detectLanguage = async (
  message: string,
  history: Array<{ role: string, content: string }> = [],
): Promise<LanguageCode> => {
  const candidates = [message, ...history.filter(h => h.role === 'user').map(h => h.content).reverse()]

  for (const candidate of candidates) {
    const text = stripNoise(candidate ?? '')
    const guess = guessByScript(text)
    if (!guess) continue
    if (guess === 'latin') return await classifyLatinLanguage(text.trim())
    return guess
  }

  return SOURCE_LANGUAGE
}
