import { serverSupabaseClient } from '#supabase/server'
import type { ResumeDatabase } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<ResumeDatabase>(event)

  const { data: educationData, error: educationError } = await client
    .schema('resume')
    .from('education')
    .select('*')
    .eq('deleted', false)
    .order('order_index', { ascending: false })

  if (educationError) {
    throw createError({ statusMessage: educationError.message })
  }

  return educationData
})
