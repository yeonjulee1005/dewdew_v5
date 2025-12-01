import { serverSupabaseClient } from '#supabase/server'
import type { ResumeDatabase } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<ResumeDatabase>(event)

  const { data: experienceData, error: experienceError } = await client
    .schema('resume')
    .from('experience')
    .select('*')
    .order('order_index', { ascending: false })

  if (experienceError) {
    throw createError({ statusMessage: experienceError.message })
  }

  return experienceData
})
