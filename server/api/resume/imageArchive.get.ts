import { serverSupabaseClient } from '#supabase/server'
import type { ResumeDatabase } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<ResumeDatabase>(event)

  const { data: imageArchiveData, error: imageArchiveError } = await client
    .schema('resume')
    .from('image_archive')
    .select('title, image_url, year, season, tags, category, order_index, year_description, deleted')
    .eq('deleted', false)
    .order('year', { ascending: false })
    .order('order_index', { ascending: true })

  if (imageArchiveError) {
    throw createError({ statusMessage: imageArchiveError.message })
  }

  return imageArchiveData
})
