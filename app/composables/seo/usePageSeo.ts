export type SeoPageKey = 'index' | 'ai' | 'aiComponents' | 'threejs' | 'blog'

export const usePageSeo = (page: SeoPageKey) => {
  const site = useSiteConfig()
  const route = useRoute()
  const { t } = useI18n()

  const title = t(`seo.${page}.title`)
  const description = t(`seo.${page}.description`)
  const pageUrl = `${site.url}${route.path}`

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogUrl: pageUrl,
    twitterTitle: title,
    twitterDescription: description,
  })

  useHead({
    link: [
      { rel: 'canonical', href: pageUrl },
      { rel: 'alternate', hreflang: 'x-default', href: pageUrl },
      { rel: 'alternate', hreflang: 'ko', href: pageUrl },
      { rel: 'alternate', hreflang: 'en', href: pageUrl },
    ],
  })
}
