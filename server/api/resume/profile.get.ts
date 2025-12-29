import { serverSupabaseClient } from '#supabase/server'
import type { ResumeDatabase } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<ResumeDatabase>(event)

  const { data: profileData, error: profileError } = await client
    .schema('resume')
    .from('profile')
    .select('ai_personality_data, full_name, title, avatar_url, location, email, phone, bio, detailed_bio, weaknesses, deleted')
    .single()

  if (profileError) {
    throw createError({ statusMessage: profileError.message })
  }

  const { data: experienceData, error: experienceError } = await client
    .schema('resume')
    .from('experience')
    .select('company_name, company_logo_url, position, description, start_date, end_date, is_current, order_index, deleted')
    .order('order_index', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (experienceError) {
    throw createError({ statusMessage: experienceError.message })
  }

  // 민감한 정보 제거 (네트워크 응답에서 숨김)
  const sanitizedProfile = {
    ...profileData,
    phone: undefined,
  }
  delete sanitizedProfile.phone

  return {
    profile: sanitizedProfile,
    experience: experienceData,
  }
})
