import { serverSupabaseClient } from '#supabase/server'
import type { ResumeDatabase } from '~/types/supabase/database.types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<ResumeDatabase>(event)

  const { data: experienceData, error: experienceError } = await client
    .schema('resume')
    .from('experience')
    .select('id, company_name, position, description, start_date, end_date, is_current, company_logo_url, order_index, deleted')
    .order('order_index', { ascending: false })

  if (experienceError) {
    throw createError({ statusMessage: experienceError.message })
  }

  // ?lang=xx 요청 시 번역본으로 덮어씀 (translate-resume Edge Function, 캐시 우선)
  return localizeResumeRows(event, 'experience', experienceData ?? [])
})
