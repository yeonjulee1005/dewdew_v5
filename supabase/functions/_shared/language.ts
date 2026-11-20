// 사용자 메시지 언어 감지 + 키워드 매칭용 질의 정규화
// - 문자 체계(script)로 판별 가능한 언어는 규칙으로 즉시 결정 (비용 0)
// - 라틴 문자권은 명백한 영어만 규칙으로, 나머지는 짧은 LLM 호출 1회
// - component-mapper · RAG 1단계 키워드는 한국어·영어만 다루므로,
//   그 외 언어는 같은 LLM 호출 1회로 질문을 한국어로 옮겨 매칭에만 사용한다 (답변 언어는 원문 기준)
// 결과 lang 은 SUPPORTED_LANGUAGES 코드 중 하나. 번역 캐시 키로도 쓰이므로 허용 목록 밖 코드는 만들지 않는다.

import { createAICompletion } from './ai-provider.ts'
import type { AIModelId } from './ai-models.ts'

// 보조 호출(언어 판별·질의 번역)은 가장 가벼운 모델 사용. 장애 시 Gateway 폴백 체인이 이어받는다
const UTILITY_MODEL_ID: AIModelId = 'google/gemini-3.5-flash-lite'
const UTILITY_MAX_INPUT_CHARS = 300
const UTILITY_MAX_OUTPUT_TOKENS = 80

// component-mapper 키워드가 직접 다루는 언어 → 질의 번역 불필요
const KEYWORD_LANGUAGES: LanguageCode[] = ['ko', 'en']

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

const stripNoise = (text: string): string =>
  text
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/\S+@\S+\.\S+/g, ' ')
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, ' ')

export interface MessageAnalysis {
  // 응답 언어
  lang: LanguageCode
  // 키워드 매칭(component-mapper · RAG 1단계)에 쓸 질의. 한국어·영어는 원문, 그 외 언어는 한국어 번역
  matchQuery: string
}

const parseCode = (raw: string | undefined, allowed: LanguageCode[], fallback: LanguageCode): LanguageCode => {
  const code = (raw ?? '').trim().toLowerCase().replace(/[^a-z]/g, '')
  return isSupportedLanguage(code) && allowed.includes(code) ? code : fallback
}

const utilityCall = (system: string, text: string) =>
  createAICompletion(
    UTILITY_MODEL_ID,
    [{ role: 'user', content: text.slice(0, UTILITY_MAX_INPUT_CHARS) }],
    system,
    { maxTokens: UTILITY_MAX_OUTPUT_TOKENS, tag: 'message-analysis' },
  )

// 라틴 문자권: 언어 판별 + (영어가 아니면) 한국어 번역을 한 번의 호출로
const analyzeLatin = async (message: string, text: string): Promise<MessageAnalysis> => {
  // ASCII 전용 + 흔한 영어 단어 → LLM 호출 없이 영어
  if (/^[\x20-\x7E\s]*$/.test(text) && ENGLISH_HINT.test(text)) return { lang: 'en', matchQuery: message }

  try {
    const answer = await utilityCall(
      `Reply in exactly two lines, nothing else.
Line 1: the language code of the user's message, one of: ${LATIN_LANGUAGES.join(', ')}.
Line 2: if the code is not en, a short natural Korean translation of the message; otherwise leave it empty.`,
      text,
    )
    // 기대 형식은 2줄이지만, 한 줄로 붙여 답하는 경우("vi: 번역", "vi | 번역")도 허용
    const parsed = answer.trim().replace(/^line\s*1\s*:\s*/i, '').replace(/\nline\s*2\s*:\s*/i, '\n').match(/^\W*([a-z]{2})\b[\s:|\-–—.]*([\s\S]*)$/i)
    const lang = parseCode(parsed?.[1], LATIN_LANGUAGES, 'en')
    const translated = (parsed?.[2] ?? '').replace(/\s+/g, ' ').trim()
    return { lang, matchQuery: lang !== 'en' && translated ? translated : message }
  }
  catch (error) {
    console.warn('[language] latin analysis failed, fallback to en:', error)
    return { lang: 'en', matchQuery: message }
  }
}

// 문자 체계로 언어가 정해진 비한국어·비영어 (ja, zh, ru, …): 한국어 번역만
const translateForMatching = async (message: string, text: string): Promise<string> => {
  try {
    const translated = (await utilityCall('Translate the user\'s message into short, natural Korean. Output only the translation.', text)).trim()
    return translated || message
  }
  catch (error) {
    console.warn('[language] query translation failed, use original:', error)
    return message
  }
}

/**
 * 사용자 마지막 메시지의 응답 언어와 키워드 매칭용 질의를 반환한다.
 * - 한국어 · 명백한 영어: LLM 호출 0회
 * - 그 외: 가벼운 모델로 1회 (입력 300자 · 출력 80토큰 상한)
 * - 판별 불가(이모지·숫자·URL만): 직전 사용자 메시지 언어 → 그것도 없으면 한국어. 매칭 질의는 원문
 */
export const analyzeMessage = async (
  message: string,
  history: Array<{ role: string, content: string }> = [],
): Promise<MessageAnalysis> => {
  const text = stripNoise(message ?? '').trim()
  const guess = guessByScript(text)

  if (guess === 'latin') return await analyzeLatin(message, text)
  if (guess) {
    const matchQuery = KEYWORD_LANGUAGES.includes(guess) ? message : await translateForMatching(message, text)
    return { lang: guess, matchQuery }
  }

  // 현재 메시지로 판별 불가 → 직전 사용자 메시지의 문자 체계로 언어만 추정 (추가 호출 없음)
  for (const previous of history.filter(h => h.role === 'user').map(h => h.content).reverse()) {
    const previousGuess = guessByScript(stripNoise(previous ?? ''))
    if (!previousGuess) continue
    return { lang: previousGuess === 'latin' ? 'en' : previousGuess, matchQuery: message }
  }

  return { lang: SOURCE_LANGUAGE, matchQuery: message }
}
