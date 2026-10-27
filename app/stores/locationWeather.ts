import { defineStore } from 'pinia'
import type { UvData, VisibilityData, WeatherObservation, WeatherFirstData, WeatherSecondData } from '~/types/weather'

export const useLocWeatherStore = defineStore('useLocWeatherStore', () => {
  /**
   * ! Pinia State !
   *
   * @param location 관측 지점 지역명 (시·도 시·군·구)
   * @param observedAt 관측 시각 (KST, YYYYMMDDHHmm)
   * @param uvData 자외선 데이터
   * @param visibilityData 시정 데이터
   * @param weatherFirstData 날씨 첫번째 데이터
   * @param weatherSecondData 날씨 두번째 데이터
   *
   */

  const { weatherMapData, loadLivingData, skyCode, windDirectionIndex, precipitationCode, visibilityLevel } = useWeatherMapData()

  const location = ref<string>('')
  const observedAt = ref<string>('')
  const uvData = ref<UvData>()
  const visibilityData = ref<VisibilityData>()
  const weatherFirstData = ref<WeatherFirstData>()
  const weatherSecondData = ref<WeatherSecondData>()

  // 요청 상태 관리
  const isFetching = ref(false)
  const lastFetchTime = ref<number>(0)
  const lastLocationKey = ref<string>('')
  const MIN_FETCH_INTERVAL = 60000 // 60초 최소 요청 간격

  /**
   * 현재 좌표 기준 관측 자료 조회
   * 좌표는 소수점 2자리(약 1km)로 반올림해 전달 (가장 가까운 관측 지점 선택에는 충분)
   */
  const fetchWeatherData = async (latitude: number, longitude: number): Promise<void> => {
    // 중복 요청 방지
    if (isFetching.value) {
      return
    }

    const lat = latitude.toFixed(2)
    const lon = longitude.toFixed(2)
    const locationKey = `${lat}-${lon}`

    // 최소 요청 간격 체크 및 같은 위치 체크
    const now = Date.now()
    if (now - lastFetchTime.value < MIN_FETCH_INTERVAL && locationKey === lastLocationKey.value) {
      return
    }

    isFetching.value = true

    try {
      const data = await $fetch<WeatherObservation | null>('/api/weather', { query: { lat, lon } })

      // 국내 관측망 범위 밖이거나 자료가 없으면 위젯 숨김
      if (!data) {
        clearWeatherData()
        return
      }

      recordWeatherData(data)
      lastFetchTime.value = now
      lastLocationKey.value = locationKey
    }
    catch (error) {
      console.error('날씨 데이터 조회 실패:', error)
    }
    finally {
      isFetching.value = false
    }
  }

  const recordWeatherData = (data: WeatherObservation) => {
    location.value = data.location
    observedAt.value = data.observedAt

    uvData.value = undefined
    if (data.uvIndex !== null) {
      uvData.value = {
        location: data.location,
        uv: loadLivingData(Math.min(Math.round(data.uvIndex), 12), 'uv'),
        uvIndex: data.uvIndex,
      }
    }

    visibilityData.value = undefined
    if (data.visibility !== null) {
      const level = visibilityLevel(data.visibility)
      visibilityData.value = {
        location: data.location,
        visibility: loadLivingData(level, 'visibility'),
        visibilityLevel: level,
        visibilityKm: Math.round(data.visibility * 10) / 10,
      }
    }

    weatherFirstData.value = undefined
    if (data.temperature !== null) {
      weatherFirstData.value = {
        sky: data.cloudAmount !== null ? getWeatherData('sky', skyCode(data.cloudAmount)) ?? '' : '',
        t1h: getWeatherData('t1h', data.temperature) ?? '',
        vec: data.windDirection !== null ? getWeatherData('vec', windDirectionIndex(data.windDirection)) ?? '' : '',
        wsd: data.windSpeed !== null ? getWeatherData('wsd', data.windSpeed) ?? '' : '',
      }
    }

    weatherSecondData.value = {
      pty: getWeatherData('pty', precipitationCode(data.weatherCode, data.rainfall)) ?? '',
      r1n: data.rainfall !== null && data.rainfall > 0 ? `${data.rainfall}mm` : '강수없음',
      reh: data.humidity !== null ? getWeatherData('reh', data.humidity) ?? '' : '',
    }
  }

  const clearWeatherData = () => {
    location.value = ''
    observedAt.value = ''
    uvData.value = undefined
    visibilityData.value = undefined
    weatherFirstData.value = undefined
    weatherSecondData.value = undefined
  }

  const getWeatherData = (type: string, value: string | number) => {
    const data = weatherMapData[type]

    if (!data) {
      return undefined
    }

    return typeof data === 'function' ? data(value) : data[value as number]
  }

  return {
    location,
    observedAt,
    uvData,
    visibilityData,
    weatherFirstData,
    weatherSecondData,
    fetchWeatherData,
  }
}, {
  persist: {
    storage: piniaPluginPersistedstate.sessionStorage(),
  },
})
