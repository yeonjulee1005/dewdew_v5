export const useImageStorage = () => {
  const config = useRuntimeConfig()

  const url = (isPublic: boolean, imageUrl: string) => {
    // 빈 문자열이나 유효하지 않은 경로 체크
    if (!imageUrl || imageUrl.trim() === '') {
      return ''
    }

    // config가 초기화되지 않았거나 supabaseUrl이 없으면 빈 문자열 반환
    if (!config.public?.supabaseUrl) {
      return ''
    }

    // 경로가 슬래시로 시작하지 않으면 추가
    const normalizedPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`

    return `${config.public.supabaseUrl}/storage/v1/object`
      .concat(isPublic ? '/public' : '/auth')
      .concat(normalizedPath)
  }
  return {
    url,
  }
}
