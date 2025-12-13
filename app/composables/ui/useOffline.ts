export const useOffline = () => {
  const isOnline = ref(navigator.onLine)

  onMounted(() => {
    window.addEventListener('online', () => {
      isOnline.value = true
    })
    window.addEventListener('offline', () => {
      isOnline.value = false
    })
  })

  onUnmounted(() => {
    window.removeEventListener('online', () => {})
    window.removeEventListener('offline', () => {})
  })

  return { isOnline }
}
