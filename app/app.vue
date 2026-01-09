<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'

const { coords, resume } = useGeolocation()

// Vercel 프로덕션 환경에서만 Speed Insights 활성화
// 로컬 preview에서는 VERCEL 환경 변수가 없으므로 비활성화
const appConfig = useAppConfig()
const { meta } = useRoute()

const isVercel = ref(false)

onMounted(() => {
  isVercel.value = !!(import.meta.env.VERCEL === '1' || import.meta.env.VERCEL === true || import.meta.env.VERCEL)
})

const { t } = useI18n()
const { genDateFormat } = useDateFormatter()

const { geoX, geoY, latitude, longitude, forecastHour, currentLocationCode } = storeToRefs(useLocWeatherStore())
const { fetchLivingData, fetchWeatherData } = useLocWeatherStore()

const { filteredLocations } = useKorLocation()
const { dfsXyConvert } = useTranslateCoords()

const seoTitle = t('seoTitle.intro')
const seoDescription = t('seoDescription.intro')
const seoImage = '/assets/dewdew.webp'
const route = useRoute()

useHead({
  title: meta.title as string,
  titleTemplate: (title?: string | undefined): string | null => {
    // index 페이지 처리
    if (route.path === '/') {
      const isValidTitle = title
        && title !== t('pageTitle.dewdew')
        && (title === seoTitle || title.includes('Software Engineer'))

      return isValidTitle ? title : seoTitle
    }

    // title이 없는 경우 기본값 반환
    if (!title) {
      return t('pageTitle.dewdew').concat(' | ', '메인')
    }

    const isTranslatedString = !title.startsWith('pageTitle.') && !title.includes('pageTitle.')
    const translatedTitle = isTranslatedString
      ? title
      : t(title.startsWith('pageTitle.') ? title : `pageTitle.${title.toLowerCase()}`, title)

    // seoTitle.intro를 포함하는 경우 그대로 반환
    if (translatedTitle.includes(seoTitle) || translatedTitle === seoTitle) {
      return translatedTitle
    }

    return t('pageTitle.dewdew').concat(' | ', translatedTitle)
  },
  link: [
    { rel: 'dns-prefetch', href: 'https://api.dewdew.dev' },
    { rel: 'preconnect', href: 'https://api.dewdew.dev', crossorigin: 'anonymous' },
    { rel: 'manifest', href: '/manifest.webmanifest' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/image/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/svg+xml', href: '/image/favicon.svg' },
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/image/favicon-96x96.png' },
    { rel: 'alternate', type: 'application/rss+xml', href: '/rss.xml' },
  ],
  meta: [
    { name: 'naver-site-verification', content: '7c406de71b03c1e444a4fe2630a29bd7a8e17559' },
    { property: 'imagetoolbar', content: 'no' },
  ],
})

useSeoMeta({
  charset: 'utf-8',
  formatDetection: 'telephone=no',
  viewport: 'width=device-width, initial-scale=1',
  title: (meta.title as string) || seoTitle,
  author: 'Dewdew',
  description: (meta.description as string) || seoDescription,
  themeColor: '#6a64c7',
  msapplicationTileColor: '#6a64c7',
  ogTitle: (meta.title as string) || seoTitle,
  ogDescription: (meta.description as string) || seoDescription,
  ogImage: seoImage,
  ogImageType: 'image/png',
  ogType: 'website',
  ogImageWidth: '1200',
  ogImageHeight: '630',
  twitterCard: 'summary_large_image',
  twitterTitle: (meta.title as string) || seoTitle,
  twitterDescription: (meta.description as string) || seoDescription,
  twitterImage: seoImage,
  twitterSite: '@dewdew',
  twitterCreator: '@dewdew',
})

// 위치 변화 임계값 및 상태 관리
const LOCATION_CHANGE_THRESHOLD = 0.001 // 약 100m
const lastCoords = ref<{ latitude: number, longitude: number } | null>(null)
const lastGridCoords = ref<{ x: number, y: number } | null>(null)

/**
 * 위치가 실제로 유의미하게 변경되었는지 확인
 */
const hasSignificantLocationChange = (newLat: number, newLng: number, newX: number, newY: number): boolean => {
  // 1. 처음 호출인 경우
  if (!lastCoords.value || !lastGridCoords.value) {
    return true
  }

  // 2. 격자 좌표(nx, ny)가 변했는지 확인 (기상청 API 호출 기준)
  if (lastGridCoords.value.x !== newX || lastGridCoords.value.y !== newY) {
    return true
  }

  // 3. 물리적 거리가 임계값 이상 변했는지 확인 (약 100m)
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

  // 격자 좌표 변환
  const rs = dfsXyConvert('toXY', lat, lng)

  // 변환 결과 유효성 검사
  if (rs.x === undefined || rs.y === undefined || rs.lat === undefined || rs.lng === undefined) {
    return
  }

  const newGeoX = Math.floor(rs.x)
  const newGeoY = Math.floor(rs.y)
  const newLat = rs.lat
  const newLng = rs.lng

  // 유의미한 위치 변화가 없으면 중단 (불필요한 API 호출 방지)
  if (!hasSignificantLocationChange(newLat, newLng, newGeoX, newGeoY)) {
    return
  }

  // 상태 업데이트
  geoX.value = newGeoX
  geoY.value = newGeoY
  latitude.value = newLat
  longitude.value = newLng

  // geoX, geoY가 undefined가 아님을 보장하고 currentLocationCode 설정
  if (geoX.value !== undefined && geoY.value !== undefined) {
    currentLocationCode.value = filteredLocations(geoX.value, geoY.value)

    // currentLocationCode가 설정된 후에만 API 호출
    if (currentLocationCode.value) {
      // 마지막 위치 저장 (변환된 좌표 사용)
      lastCoords.value = { latitude: newLat, longitude: newLng }
      lastGridCoords.value = { x: newGeoX, y: newGeoY }

      // 데이터 호출 (순차적으로 실행하여 중복 호출 방지)
      // 생활지수 API를 먼저 호출하고, 완료 후 날씨 API 호출
      fetchLivingData()
        .catch(() => {
          // 에러는 store에서 처리하므로 여기서는 무시
        })
        .finally(() => {
          // 생활지수 API 완료 후 날씨 API 호출 (약간의 지연을 두어 API 부하 분산)
          setTimeout(() => {
            fetchWeatherData().catch(() => {
              // 에러는 store에서 처리하므로 여기서는 무시
            })
          }, 500) // 0.5초 지연
        })
    }
  }
}

// 시간 변경 감시 (실제 시간이 바뀔 때만 실행)
const lastHour = ref<string | null>(null)
watch(() => genDateFormat('HH'), (currentHour) => {
  // 시간이 실제로 바뀌었을 때만 실행
  if (lastHour.value !== null && lastHour.value !== currentHour) {
    const newForecastHour = currentHour.concat('00')
    // forecastHour가 다를 때만 API 호출
    if (newForecastHour !== forecastHour.value) {
      fetchLivingData()
      fetchWeatherData()
    }
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
  <DdApp :toaster="appConfig.toaster">
    <VitePwaManifest />
    <NuxtLayout>
      <NuxtLoadingIndicator
        color="repeating-linear-gradient(to right,#f59e42 0%,#fbbf24 100%)"
        :height="5"
      />
      <NuxtPage />
    </NuxtLayout>
    <Analytics v-if="isVercel" />
    <SpeedInsights v-if="isVercel" />
  </DdApp>
</template>
