import { serverSupabaseClient } from '#supabase/server'
import type { ResumeDatabase } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<ResumeDatabase>(event)

  const { data: socialLinksData, error: socialLinksError } = await client
    .schema('resume')
    .from('social_links')
    .select('platform, url, icon_url, order_index, deleted')
    .eq('deleted', false)
    .order('order_index', { ascending: true })

  if (socialLinksError) {
    throw createError({ statusMessage: socialLinksError.message })
  }

  return socialLinksData
})
