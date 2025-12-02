export const useImageStorage = () => {
  const config = useRuntimeConfig()

  const url = (isPublic: boolean, imageUrl: string) => {
    return `${config.public.supabaseUrl}/storage/v1/object`
      .concat(isPublic ? '/public' : '/auth')
      .concat(imageUrl)
  }
  return {
    url,
  }
}
