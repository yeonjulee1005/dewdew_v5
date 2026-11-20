import { serverSupabaseClient } from '#supabase/server'
import type { ResumeDatabase } from '~/types/supabase/database.types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<ResumeDatabase>(event)

  const { data: threejsData, error: threejsError } = await client
    .schema('resume')
    .from('threejs')
    .select('id, title, description, url, order_index, deleted')
    .eq('deleted', false)
    .order('order_index', { ascending: false })

  if (threejsError) {
    throw createError({ statusMessage: threejsError.message })
  }

  // ?lang=xx 요청 시 번역본으로 덮어씀 (translate-resume Edge Function, 캐시 우선)
  return localizeResumeRows(event, 'threejs', threejsData ?? [])
})
