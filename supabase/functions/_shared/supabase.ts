import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

let supabaseInstance: SupabaseClient | null = null

export const getSupabaseClient = (): SupabaseClient => {
  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  supabaseInstance = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return supabaseInstance
}

// resume 스키마 쿼리 헬퍼
export const resumeQuery = (table: string) => {
  return getSupabaseClient().from(table).select('*')
}
