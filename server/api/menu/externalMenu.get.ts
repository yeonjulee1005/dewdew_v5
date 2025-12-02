import { serverSupabaseClient } from '#supabase/server'
import type { MenuDatabase } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<MenuDatabase>(event)

  const { data, error } = await client
    .schema('menu')
    .from('externalMenu')
    .select('*')
    .eq('deleted', false)
    .lt('index', 3)
    .order('index', { ascending: true })

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})
