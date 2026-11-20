import { serverSupabaseClient } from '#supabase/server'
import type { ResumeDatabase } from '~/types/supabase/database.types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<ResumeDatabase>(event)

  const { data: skillsData, error: skillsError } = await client
    .schema('resume')
    .from('skills')
    .select('id, category, name, proficiency, icon_url, order_index, deleted')
    .order('proficiency', { ascending: false })
    .order('order_index', { ascending: true })

  if (skillsError) {
    throw createError({ statusMessage: skillsError.message })
  }

  // ?lang=xx 요청 시 번역본으로 덮어씀 (translate-resume Edge Function, 캐시 우선)
  return localizeResumeRows(event, 'skills', skillsData ?? [])
})
