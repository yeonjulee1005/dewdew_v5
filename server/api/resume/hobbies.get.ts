import { serverSupabaseClient } from '#supabase/server'
import type { ResumeDatabase } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<ResumeDatabase>(event)

  const { data: hobbiesData, error: hobbiesError } = await client
    .schema('resume')
    .from('hobbies')
    .select('title, description, icon_url, order_index, deleted')
    .eq('deleted', false)
    .order('order_index', { ascending: true })

  if (hobbiesError) {
    throw createError({ statusMessage: hobbiesError.message })
  }

  return hobbiesData
})
