import { serverSupabaseClient } from '#supabase/server'
import type { ResumeDatabase } from '~/types/supabase/database.types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<ResumeDatabase>(event)

  const { data: projectsData, error: projectsError } = await client
    .schema('resume')
    .from('projects')
    .select('id, title, description, tech_stack, thumbnail_url, project_url, github_url, description_image_url, start_date, end_date, highlights, order_index, deleted')
    .eq('deleted', false)
    .order('order_index', { ascending: false })

  if (projectsError) {
    throw createError({ statusMessage: projectsError.message })
  }

  // ?lang=xx 요청 시 번역본으로 덮어씀 (translate-resume Edge Function, 캐시 우선)
  return localizeResumeRows(event, 'projects', projectsData ?? [])
})
