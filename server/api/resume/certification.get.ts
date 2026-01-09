import { serverSupabaseClient } from '#supabase/server'
import type { ResumeDatabase } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<ResumeDatabase>(event)

  const { data: certificationsData, error: certificationsError } = await client
    .schema('resume')
    .from('certifications')
    .select('title, description, credential_url, expiry_date, issue_date, issuer, order_index, deleted')
    .eq('deleted', false)
    .order('order_index', { ascending: true })

  if (certificationsError) {
    throw createError({ statusMessage: certificationsError.message })
  }

  return certificationsData
})
