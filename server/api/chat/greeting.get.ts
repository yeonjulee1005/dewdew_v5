import { filterStream } from '../../utils/stream-filter'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    const url = `${config.supabaseUrl}/functions/v1/dewdew-rag-portfolio`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.supabaseKey}`,
      },
      body: JSON.stringify({
        message: '안녕',
        history: [],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Greeting error:', response.status, errorText)
      throw createError({
        statusCode: response.status,
        message: 'Greeting API error',
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

    // 스트림 필터링 후 전달
    const filteredStream = await filterStream(response.body)
    return sendStream(event, filteredStream)
  }
  catch (error: any) {
    console.error('Greeting proxy error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error',
    })
  }
})
