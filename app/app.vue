<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'

const { coords, resume } = useGeolocation()

// Vercel 프로덕션 환경에서만 Speed Insights 활성화
// 로컬 preview에서는 VERCEL 환경 변수가 없으므로 비활성화
const appConfig = useAppConfig()
const { meta } = useRoute()

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
  charset: 'utf-16',
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

// 위치 변화 임계값 (미터 단위, 약 100m)
const LOCATION_CHANGE_THRESHOLD = 0.001 // 약 100m (위도/경도 차이)

// 마지막 위치 저장
interface LastCoords {
  latitude: number
  longitude: number
}
const lastCoords = ref<LastCoords | null>(null)

// 위치가 크게 변경되었는지 확인
const hasLocationChanged = (newLat: number, newLng: number): boolean => {
  if (!lastCoords.value) {
    return true
  }

  const latDiff = Math.abs(newLat - lastCoords.value.latitude)
  const lngDiff = Math.abs(newLng - lastCoords.value.longitude)

  return latDiff > LOCATION_CHANGE_THRESHOLD || lngDiff > LOCATION_CHANGE_THRESHOLD
}

const initWeatherData = () => {
  // 좌표 유효성 검사
  if (coords.value.latitude === undefined || coords.value.longitude === undefined) {
    return
  }

  const rs = dfsXyConvert('toXY', coords.value.latitude, coords.value.longitude)

  // 변환 결과 유효성 검사
  if (rs.x === undefined || rs.y === undefined || rs.lat === undefined || rs.lng === undefined) {
    return
  }

  const newGeoX = Math.floor(rs.x)
  const newGeoY = Math.floor(rs.y)
  const newLat = rs.lat
  const newLng = rs.lng

  // 위치가 크게 변경되지 않았으면 스킵
  if (!hasLocationChanged(newLat, newLng) && geoX.value === newGeoX && geoY.value === newGeoY) {
    return
  }

  geoX.value = newGeoX
  geoY.value = newGeoY
  latitude.value = newLat
  longitude.value = newLng

  // geoX, geoY가 undefined가 아님을 보장
  if (geoX.value !== undefined && geoY.value !== undefined) {
    currentLocationCode.value = filteredLocations(geoX.value, geoY.value)
  }

  // 마지막 위치 업데이트
  lastCoords.value = { latitude: newLat, longitude: newLng }

  fetchLivingData()
  fetchWeatherData()
}

watch(() => genDateFormat('HH'), () => {
  if (genDateFormat('HH').concat('00') !== forecastHour.value) {
    fetchLivingData()
    fetchWeatherData()
  }
})

// 디바운싱을 위한 타이머
let debounceTimer: ReturnType<typeof setTimeout> | null = null
const DEBOUNCE_DELAY = 2000 // 2초 디바운스

watch(() => coords.value, () => {
  if (coords.value.latitude === Infinity) {
    resume()
    return
  }

  // 기존 타이머 클리어
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  // 디바운싱: 2초 후에 실행
  debounceTimer = setTimeout(() => {
    initWeatherData()
    debounceTimer = null
  }, DEBOUNCE_DELAY)
}, { immediate: true })

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
    <Analytics />
    <SpeedInsights />
  </DdApp>
</template>
