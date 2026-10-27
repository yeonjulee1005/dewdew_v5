<script setup lang="ts">
import { Analytics, type BeforeSendEvent } from '@vercel/analytics/vue'
import { SpeedInsights } from '@vercel/speed-insights/vue'

const beforeSend = (event: BeforeSendEvent) => {
  // 개발 환경에서만 로그 출력
  if (!isVercelProduction) {
    console.log('Sending event:', event)
  }
  // 이벤트를 항상 반환 (필터링하지 않음)
  return event
}

const { coords, resume } = useGeolocation()

const appConfig = useAppConfig()

const isVercel = import.meta.env.VERCEL === '1'
const isVercelProduction = import.meta.env.VERCEL_ENV === 'production' || (isVercel && import.meta.env.PROD)

const { genDateFormat } = useDateFormatter()

useAppSeo()

const { fetchWeatherData } = useLocWeatherStore()

useHead({
  link: [
    { rel: 'manifest', href: '/manifest.webmanifest' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/image/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/image/favicon-96x96.png' },
    { rel: 'alternate', type: 'application/rss+xml', href: '/rss.xml' },
  ],
  meta: [
    { name: 'naver-site-verification', content: '7c406de71b03c1e444a4fe2630a29bd7a8e17559' },
    { property: 'imagetoolbar', content: 'no' },
  ],
})

// 위치 변화 임계값 및 상태 관리
const LOCATION_CHANGE_THRESHOLD = 0.001 // 약 100m
const lastCoords = ref<{ latitude: number, longitude: number } | null>(null)

/**
 * 위치가 실제로 유의미하게 변경되었는지 확인
 */
const hasSignificantLocationChange = (newLat: number, newLng: number): boolean => {
  // 처음 호출인 경우
  if (!lastCoords.value) {
    return true
  }

  // 물리적 거리가 임계값 이상 변했는지 확인 (약 100m)
  const latDiff = Math.abs(newLat - lastCoords.value.latitude)
  const lngDiff = Math.abs(newLng - lastCoords.value.longitude)

  return latDiff > LOCATION_CHANGE_THRESHOLD || lngDiff > LOCATION_CHANGE_THRESHOLD
}

const initWeatherData = () => {
  // 좌표 유효성 검사
  if (!coords.value || coords.value.latitude === undefined || coords.value.longitude === undefined) {
    return
  }

  const lat = coords.value.latitude
  const lng = coords.value.longitude

  // Infinity 또는 0 제외
  if (lat === Infinity || lng === Infinity || !lat || !lng) {
    return
  }

  // 유의미한 위치 변화가 없으면 중단 (불필요한 API 호출 방지)
  if (!hasSignificantLocationChange(lat, lng)) {
    return
  }

  lastCoords.value = { latitude: lat, longitude: lng }

  fetchWeatherData(lat, lng).catch(() => {
    // 에러는 store에서 처리하므로 여기서는 무시
  })
}

// 시간 변경 감시 (지상관측 자료는 1시간 주기로 갱신)
const lastHour = ref<string | null>(null)
watch(() => genDateFormat('HH'), (currentHour) => {
  // 시간이 실제로 바뀌었을 때만 실행
  if (lastHour.value !== null && lastHour.value !== currentHour && lastCoords.value) {
    fetchWeatherData(lastCoords.value.latitude, lastCoords.value.longitude)
  }
  lastHour.value = currentHour
}, { immediate: false })

// 디바운싱을 위한 타이머
let debounceTimer: ReturnType<typeof setTimeout> | null = null
const DEBOUNCE_DELAY = 2000 // 2초 디바운스

// 초기 로드 여부 추적 (새로고침 시 딱 한 번만 실행하기 위함)
const isInitialLoad = ref(true)

// 좌표 변경 감시 (초기 로드 완료 후에만 동작)
watch(() => coords.value, () => {
  // 초기 로드 중이면 watch는 실행하지 않음 (onMounted에서 처리)
  if (isInitialLoad.value) {
    return
  }

  // 위치 정보가 아직 없으면 재개 시도
  if (!coords.value || coords.value.latitude === Infinity || coords.value.longitude === Infinity) {
    resume()
    return
  }

  // 기존 타이머 클리어
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  // 디바운싱: 2초 후에 정확한 위치 정보로 데이터 요청
  debounceTimer = setTimeout(() => {
    initWeatherData()
    debounceTimer = null
  }, DEBOUNCE_DELAY)
}, { immediate: false })

// 초기 로드 시 딱 한 번만 실행
onMounted(() => {
  if (coords.value && coords.value.latitude !== Infinity && coords.value.longitude !== Infinity) {
    // 초기 로드는 약간의 지연 후 실행 (위치 정보가 안정화될 때까지)
    setTimeout(() => {
      initWeatherData()
      isInitialLoad.value = false // 초기 로드 완료 표시
    }, 1000)
  }
  else {
    // 위치 정보가 없으면 재개 시도
    resume()
    // 위치 정보를 기다리는 경우, watch에서 처리하도록 하지 않고
    // resume() 후 좌표가 설정되면 onMounted의 setTimeout이 완료된 후에야 watch가 동작
    setTimeout(() => {
      isInitialLoad.value = false // 초기 로드 완료 표시
    }, 2000) // resume() 후 좌표 설정까지 시간을 고려
  }
})

// PWA 상태 감시 초기화
const { watchPwaStates } = useInstallPwa()
watchPwaStates()

// 컴포넌트 언마운트 시 타이머 클리어
onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
})
</script>

<template>
  <div>
    <DdApp :toaster="appConfig.toaster">
      <VitePwaManifest />
      <NuxtLayout>
        <NuxtLoadingIndicator
          color="repeating-linear-gradient(to right,#f59e42 0%,#fbbf24 100%)"
          :height="5"
        />
        <NuxtPage />
      </NuxtLayout>
    </DdApp>
    <ClientOnly>
      <Analytics
        :debug="!isVercelProduction"
        :before-send="beforeSend"
      />
      <SpeedInsights
        :debug="!isVercelProduction"
        :mode="isVercelProduction ? 'production' : 'development'"
      />
    </ClientOnly>
  </div>
</template>
