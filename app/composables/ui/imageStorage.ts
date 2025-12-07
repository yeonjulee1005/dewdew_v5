export const useImageStorage = () => {
  const config = useRuntimeConfig()

  const url = (isPublic: boolean, imageUrl: string) => {
    // 프로덕션 환경에서는 이미지 프록시 API를 사용하여 긴 캐시 헤더 설정
    // 개발 환경에서는 직접 Supabase Storage URL 사용
    if (import.meta.env.PROD && isPublic) {
      // 이미지 경로에서 /public 제거하고 프록시 API 경로로 변환
      const cleanPath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl
      return `/api/images/${cleanPath}`
    }

    return `${config.public.supabaseUrl}/storage/v1/object`
      .concat(isPublic ? '/public' : '/auth')
      .concat(imageUrl)
  }
  return {
    url,
  }
}
