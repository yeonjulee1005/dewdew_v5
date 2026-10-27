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

  /**
   * 공개 Storage 이미지를 리사이즈·webp 변환 URL로 반환 (Supabase Image Transformation)
   * NuxtImg를 쓰지 않는 컴포넌트(DdAvatar 등)에서 원본 대신 작은 이미지를 받기 위해 사용
   */
  const renderUrl = (imageUrl: string, modifiers: { width?: number, height?: number, quality?: number } = {}) => {
    const objectUrl = url(true, imageUrl)
    if (!objectUrl) {
      return ''
    }

    const query = Object.entries(modifiers)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    return objectUrl.replace('/storage/v1/object/public', '/storage/v1/render/image/public')
      .concat(query ? `?${query}` : '')
  }

  /**
   * 공개 Storage 원본 URL → Storage 내부 경로 (NuxtImg supabase provider용)
   * 예: https://api.dewdew.dev/storage/v1/object/public/blog/a.webp → /blog/a.webp
   * Storage 이미지가 아니면 null
   */
  const toStoragePath = (imageUrl: string) => {
    const prefix = `${config.public?.supabaseUrl}/storage/v1/object/public`
    return config.public?.supabaseUrl && imageUrl.startsWith(prefix) ? imageUrl.slice(prefix.length) : null
  }

  return {
    url,
    renderUrl,
    toStoragePath,
  }
}
