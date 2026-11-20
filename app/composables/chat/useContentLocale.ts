import type { MaybeRefOrGetter } from 'vue'

// UI 라벨 번역 파일이 존재하는 locale (i18n/locales). 그 외 언어는 영어 라벨로 표시
const UI_LOCALES = ['ko', 'en'] as const
type UILocale = typeof UI_LOCALES[number]

const isUILocale = (value: string): value is UILocale => (UI_LOCALES as readonly string[]).includes(value)
const SOURCE_LANGUAGE = 'ko'

/**
 * 다이나믹 카드의 표시 언어를 메시지 단위로 결정한다.
 * - lang: AI 응답 언어(ISO 639-1). 없으면 사이트 locale 을 따른다 (/ai/components 데모 등)
 * - 콘텐츠: resumeQuery 를 useFetch query 로 넘기면 서버가 번역본을 반환
 * - 라벨: ct() — 사이트 locale 과 무관하게 해당 언어 라벨 사용 (ko/en 외에는 en)
 * - 날짜: formatYearMonth() — Intl 로 해당 언어 포맷
 */
export const useContentLocale = async (lang: MaybeRefOrGetter<string | null | undefined>) => {
  const { t, locale } = useI18n()
  const nuxtApp = useNuxtApp()

  const contentLang = computed(() => toValue(lang) || locale.value)
  const uiLocale = computed<UILocale>(() => (isUILocale(contentLang.value) ? contentLang.value : 'en'))

  // 사이트 locale 과 다른 라벨 locale 은 메시지를 미리 로드 (lazy 로딩 대응)
  if (uiLocale.value !== locale.value) {
    await nuxtApp.$i18n.loadLocaleMessages(uiLocale.value)
  }

  const ct = (key: string, fallback?: string): string =>
    fallback === undefined
      ? t(key, {}, { locale: uiLocale.value })
      : t(key, {}, { locale: uiLocale.value, default: fallback })

  const resumeQuery = computed(() =>
    contentLang.value === SOURCE_LANGUAGE ? {} : { lang: contentLang.value },
  )

  const formatYearMonth = (dateString: string | null | undefined): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
    try {
      return date.toLocaleDateString(contentLang.value, { year: 'numeric', month: 'long' })
    }
    catch {
      return date.toLocaleDateString('en', { year: 'numeric', month: 'long' })
    }
  }

  return {
    contentLang,
    uiLocale,
    ct,
    resumeQuery,
    formatYearMonth,
  }
}
