import { serverSupabaseClient } from '#supabase/server'
import type { ResumeDatabase } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<ResumeDatabase>(event)

  const { data: skillsData, error: skillsError } = await client
    .schema('resume')
    .from('skills')
    .select('*')
    .order('proficiency', { ascending: false })
    .order('order_index', { ascending: true })

  if (skillsError) {
    throw createError({ statusMessage: skillsError.message })
  }

  return skillsData
})
