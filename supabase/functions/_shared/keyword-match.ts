// 키워드 매칭 공용 헬퍼 (component-mapper · RAG 1단계 · 컴포넌트 보정 규칙)
//
// - 한글 등 비ASCII 키워드: 부분 문자열 매칭 (조사·어미가 붙는 한국어 특성상 기존 동작 유지: "경력이", "경력은")
// - ASCII(영문·숫자) 키워드: 단어 경계 매칭 — 부분 문자열 오탐 방지
//     · 3글자 이하("hi", "who", "job", "3d"): 단어 전체 일치 ("Which"·"this"·"nghiệm" 의 "hi" 오탐 방지)
//     · 4글자 이상: 단어 시작 일치 ("project" → "projects", "education" → "educational")
// 단어 경계는 라틴 문자(확장 포함: 베트남어 "nghiệm" 등)·숫자 기준. 한글이 붙어 있으면 경계로 본다.

const ASCII_KEYWORD = /^[\x20-\x7E]+$/
const SHORT_KEYWORD_LENGTH = 3
// 단어 경계 판단은 라틴 문자·숫자만 — 한글 조사가 바로 붙는 경우("sns를", "3d작업물")는 기존처럼 매칭
const WORD_CHAR = '[\\p{Script=Latin}\\p{N}]'

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const patternCache = new Map<string, RegExp>()

const keywordPattern = (keyword: string): RegExp => {
  const cached = patternCache.get(keyword)
  if (cached) return cached

  const escaped = escapeRegExp(keyword)
  const tail = keyword.length <= SHORT_KEYWORD_LENGTH ? `(?!${WORD_CHAR})` : ''
  const pattern = new RegExp(`(?<!${WORD_CHAR})${escaped}${tail}`, 'u')
  patternCache.set(keyword, pattern)
  return pattern
}

/** 소문자로 변환된 텍스트에 키워드가 포함되는지 */
export const includesKeyword = (lowerText: string, keyword: string): boolean => {
  const lowerKeyword = keyword.toLowerCase()
  if (!ASCII_KEYWORD.test(lowerKeyword)) return lowerText.includes(lowerKeyword)
  return keywordPattern(lowerKeyword).test(lowerText)
}

/** 텍스트에 키워드 중 하나라도 포함되는지 */
export const matchKeywords = (text: string, keywords: string[]): boolean => {
  const lowerText = text.toLowerCase()
  return keywords.some(keyword => includesKeyword(lowerText, keyword))
}
