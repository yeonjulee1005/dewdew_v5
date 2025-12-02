import { serverSupabaseClient } from '#supabase/server'
import type { ResumeDatabase } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<ResumeDatabase>(event)

  const { data: profileData, error: profileError } = await client
    .schema('resume')
    .from('profile')
    .select('*')
    .single()

  if (profileError) {
    throw createError({ statusMessage: profileError.message })
  }

  const { data: experienceData, error: experienceError } = await client
    .schema('resume')
    .from('experience')
    .select('*')
    .order('order_index', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (experienceError) {
    throw createError({ statusMessage: experienceError.message })
  }

  return {
    profile: profileData,
    experience: experienceData,
  }
})
