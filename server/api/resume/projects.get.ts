import { serverSupabaseClient } from '#supabase/server'
import type { ResumeDatabase } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<ResumeDatabase>(event)

  const { data: projectsData, error: projectsError } = await client
    .schema('resume')
    .from('projects')
    .select('*')
    .eq('deleted', false)
    .order('order_index', { ascending: false })

  if (projectsError) {
    throw createError({ statusMessage: projectsError.message })
  }

  return projectsData
})
