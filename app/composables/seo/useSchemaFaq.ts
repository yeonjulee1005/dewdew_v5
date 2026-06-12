type SchemaFaqItem = {
  name: string
  acceptedAnswer: {
    text: string
  }
}

type SchemaFaqOptions = {
  mainEntity: SchemaFaqItem[]
}

/** nuxt-aeo useSchemaFaq 호환 — nuxt-schema-org FAQPage로 매핑 */
export const useSchemaFaq = (options: SchemaFaqOptions) => {
  useSchemaOrg([
    defineWebPage({
      '@type': 'FAQPage',
    }),
    ...options.mainEntity.map(item =>
      defineQuestion({
        name: item.name,
        acceptedAnswer: item.acceptedAnswer.text,
      }),
    ),
  ])
}
