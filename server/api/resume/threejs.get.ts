import { serverSupabaseClient } from '#supabase/server'
import type { ResumeDatabase } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<ResumeDatabase>(event)

  const { data: threejsData, error: threejsError } = await client
    .schema('resume')
    .from('threejs')
    .select('title, description, url, order_index, deleted')
    .eq('deleted', false)
    .order('order_index', { ascending: false })

  if (threejsError) {
    throw createError({ statusMessage: threejsError.message })
  }

  return threejsData
})
