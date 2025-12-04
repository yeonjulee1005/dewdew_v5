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
