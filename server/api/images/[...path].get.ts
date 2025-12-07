/**
 * Supabase Storage 이미지 프록시 API
 * 이미지에 대한 긴 캐시 헤더를 설정하여 Lighthouse 캐시 최적화 개선
 */
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  const config = useRuntimeConfig()

  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Image path is required',
    })
  }

  // Supabase Storage URL 구성
  const supabaseUrl = config.public.supabaseUrl
  const imageUrl = `${supabaseUrl}/storage/v1/object/public/${path}`

  try {
    // Supabase Storage에서 이미지 가져오기
    const response = await fetch(imageUrl)

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: 'Failed to fetch image',
      })
    }

    // 이미지 데이터 가져오기
    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/webp'

    // 긴 캐시 헤더 설정 (1년)
    setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'X-Content-Type-Options', 'nosniff')

    return new Uint8Array(imageBuffer)
  }
  catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to proxy image',
    })
  }
})
