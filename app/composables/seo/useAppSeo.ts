export const useAppSeo = () => {
  const site = useSiteConfig()
  const { t, locale } = useI18n()

  const ogImage = `${site.url}/image/web-app-manifest-512x512.png`

  useHead({
    htmlAttrs: {
      lang: locale,
    },
    titleTemplate: (title?: string) => {
      return title && !title.includes(t('pageTitle.dewdew'))
        ? `${title} | ${t('pageTitle.dewdew')}`
        : null
    },
  })

  useSeoMeta({
    charset: 'utf-8',
    formatDetection: 'telephone=no',
    viewport: 'width=device-width, initial-scale=1',
    author: 'Dewdew',
    themeColor: '#6a64c7',
    msapplicationTileColor: '#6a64c7',
    ogType: 'website',
    ogImage,
    ogImageWidth: '1200',
    ogImageHeight: '630',
    twitterCard: 'summary_large_image',
    twitterImage: ogImage,
    twitterSite: '@dewdew',
    twitterCreator: '@dewdew',
  })

  useSchemaOrg([
    defineWebSite({
      name: t('pageTitle.dewdew'),
      description: t('seo.index.description'),
      inLanguage: ['ko-KR', 'en-US'],
    }),
    defineOrganization({
      name: 'Dewdew',
      url: site.url,
      sameAs: [
        'https://twitter.com/dewdew',
        'https://github.com/yeonjulee1005',
        'https://www.linkedin.com/in/yeonjulee1005/',
      ],
    }),
  ])
}
