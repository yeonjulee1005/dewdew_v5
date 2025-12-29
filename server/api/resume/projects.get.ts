import { serverSupabaseClient } from '#supabase/server'
import type { ResumeDatabase } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<ResumeDatabase>(event)

  const { data: projectsData, error: projectsError } = await client
    .schema('resume')
    .from('projects')
    .select('title, description, tech_stack, thumbnail_url, project_url, github_url, description_image_url, start_date, end_date, highlights, order_index, deleted')
    .eq('deleted', false)
    .order('order_index', { ascending: false })

  if (projectsError) {
    throw createError({ statusMessage: projectsError.message })
  }

  return projectsData
})
