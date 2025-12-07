// ============================================
// 초기 임베딩 생성 Edge Function
// 모든 문서의 임베딩을 생성하여 데이터베이스에 저장
// ============================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { initializeAllEmbeddings } from '../_shared/embedding-manager.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req: Request): Promise<Response> => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // POST만 허용
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }

  try {
    console.log('Starting embedding initialization...')
    await initializeAllEmbeddings()

    return new Response(
      JSON.stringify({
        success: true,
        message: 'All embeddings initialized successfully',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
  catch (error) {
    console.error('Initialization error:', error)

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
