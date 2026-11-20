// 지원하지 않는 브라우저 언어 → 영어 폴백
// - @nuxtjs/i18n 의 detectBrowserLanguage 는 일치하는 언어가 없으면 defaultLocale(ko)로 둔다.
// - detectBrowserLanguage.fallbackLocale 을 쓰면 Accept-Language 가 없는 크롤러까지 en 이 되어 한국어 SEO 에 영향을 주므로,
//   "선호 언어 목록이 있고, 그중 ko·en 이 하나도 없을 때"만 en 으로 전환한다.
const SUPPORTED = ['ko', 'en']

const preferredLanguages = (): string[] => {
  if (import.meta.server) {
    const header = useRequestHeaders(['accept-language'])['accept-language'] ?? ''
    return header.split(',').map(part => part.split(';')[0]?.trim() ?? '').filter(Boolean)
  }
  return [...(navigator.languages ?? [])]
}

export default defineNuxtPlugin({
  name: 'i18n-locale-fallback',
  async setup(nuxtApp) {
    const languages = preferredLanguages()
      .map(tag => tag.toLowerCase().split('-')[0] ?? '')
      .filter(code => code && code !== '*')

    if (languages.length === 0) return
    if (languages.some(code => SUPPORTED.includes(code))) return

    const i18n = nuxtApp.$i18n
    if (i18n.locale.value !== 'en') {
      await i18n.setLocale('en')
    }
  },
})
