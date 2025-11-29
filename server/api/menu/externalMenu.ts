import { serverSupabaseClient } from '#supabase/server'
import type { MenuDatabase } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  // MenuDatabase 타입을 제네릭으로 전달하여 menu 스키마 타입 안전성 보장
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
