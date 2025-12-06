import { serverSupabaseClient } from '#supabase/server'
import type { ResumeDatabase } from '~/types/database.types'

/**
 * 채팅 히스토리를 데이터베이스에 저장하는 함수
 * @param event - Nuxt 이벤트 객체
 * @param userAgent - 사용자 User Agent 문자열
 * @param message - 사용자가 입력한 메시지
 */
const saveChatHistory = async (
  event: any,
  userAgent: string,
  message: string,
): Promise<void> => {
  try {
    const supabase = await serverSupabaseClient<ResumeDatabase>(event)
    const { error } = await supabase
      .schema('resume')
      .from('chat_history')
      .insert({
        user_agent: userAgent,
        request_message: message,
      })

    if (error) {
      console.error('Failed to save chat history:', error)
    }
  }
  catch (error) {
    // 히스토리 저장 실패는 로그만 남기고 계속 진행
    console.error('Error saving chat history:', error)
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  // 입력 검증
  if (!body.message || typeof body.message !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'Message is required',
    })
  }

  // User Agent 추출
  const userAgent = getHeader(event, 'user-agent') || 'unknown'

  // 히스토리 저장 (비동기로 처리하여 응답 지연 최소화)
  saveChatHistory(event, userAgent, body.message)

  try {
    // Supabase Edge Function 호출 (URL은 서버에만 존재)
    const response = await fetch(
      `${config.supabaseUrl}/functions/v1/dewdew-rag-portfolio`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.supabaseKey}`,
        },
        body: JSON.stringify({
          message: body.message,
          history: body.history || [],
        }),
      },
    )

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        message: 'Chat API error',
      })
    }

    if (!response.body) {
      throw createError({
        statusCode: 500,
        message: 'No response body from Supabase',
      })
    }

    // 스트리밍 응답 헤더 설정
    setResponseHeader(event, 'Content-Type', 'text/event-stream')
    setResponseHeader(event, 'Cache-Control', 'no-cache')
    setResponseHeader(event, 'Connection', 'keep-alive')
    setResponseHeader(event, 'X-Accel-Buffering', 'no')

    // 스트리밍 응답 전달
    return sendStream(event, response.body as ReadableStream)
  }
  catch (error: any) {
    console.error('Chat proxy error:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error',
    })
  }
})
