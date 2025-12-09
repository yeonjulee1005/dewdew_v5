import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.string().optional(),
        tags: z.array(z.string()).optional(),
        authors: z.array(z.object({
          name: z.string(),
          avatarUrl: z.string().optional(),
          link: z.string().optional(),
        })).optional(),
        category: z.string().optional(),
        head: z.object({
          meta: z.array(z.object({
            name: z.string().optional(),
            content: z.string().optional(),
          })).optional(),
        }).optional(),
      }),
    }),
  },
})
