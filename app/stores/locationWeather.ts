import { defineStore } from 'pinia'
import type { KoreanLocationCode, UvData, AirDiffusionData, WeatherData, WeatherItem, WeatherFirstData, WeatherSecondData } from '~/types/weather'

export const useLocWeatherStore = defineStore('useLocWeatherStore', () => {
  /**
   * ! Pinia State !
   *
   * @param geoX 기상청 격자 X
   * @param geoY 기상청 격자 Y
   * @param latitude 위도
   * @param longitude 경도
   * @param forecastHour 예보 시간
   * @param currentLocationCode 현지 지역 코드
   * @param airDiffusionData 대기질 데이터
   * @param uvData 자외선 데이터
   * @param weatherFirstData 날씨 첫번째 데이터
   * @param weatherSecondData 날씨 두번째 데이터
   *
   */

  const { weatherMapData, loadLivingData } = useWeatherMapData()
  const { livingIndexQuery, weatherQuery } = useQuery()
  const { genDateFormat, getLastHour, getMinute } = useDateFormatter()

  const geoX = ref<number | undefined>(undefined)
  const geoY = ref<number | undefined>(undefined)
  const latitude = ref<number | undefined>(undefined)
  const longitude = ref<number | undefined>(undefined)
  const forecastHour = ref<string>('')
  const currentLocationCode = ref<KoreanLocationCode>()
  const uvData = ref<UvData>()
  const airDiffusionData = ref<AirDiffusionData>()
  const weatherFirstData = ref<WeatherFirstData>()
  const weatherSecondData = ref<WeatherSecondData>()

  // 요청 상태 관리
  const isFetchingWeather = ref(false)
  const isFetchingLiving = ref(false)
  const lastWeatherFetchTime = ref<number>(0) // 날씨 API 전용 마지막 호출 시간
  const lastLivingFetchTime = ref<number>(0) // 생활지수 API 전용 마지막 호출 시간
  const lastLocationKey = ref<string>('')
  const lastLivingLocationKey = ref<string>('') // 생활지수 API 전용 위치 키
  const retryCount = ref<number>(0)
  const MAX_RETRY = 3
  const MIN_FETCH_INTERVAL = 60000 // 60초 최소 요청 간격 (30초에서 증가)
  const RETRY_DELAY_BASE = 2000 // 재시도 기본 지연 시간 (2초)
  const isAnyFetching = ref(false) // 전역 요청 락

  const getForecastHour = () => {
    forecastHour.value = acceptableMinute() ? getLastHour().concat('00') : genDateFormat('HH').concat('00')
    return forecastHour.value
  }

  const acceptableMinute = () => {
    return parseInt(getMinute('mm')) < 35
  }

  const fetchLivingData = async (retryAttempt = 0): Promise<void> => {
    // 전역 요청 락 체크 (다른 API 호출 중이면 대기)
    if (isAnyFetching.value && retryAttempt === 0) {
      return
    }

    // 중복 요청 방지
    if (isFetchingLiving.value) {
      return
    }

    // 위치 키 생성 (같은 위치인지 확인)
    const locationKey = `${currentLocationCode.value?.code ?? 0}-${genDateFormat('YYYYMMDDHH')}`
    // 최소 요청 간격 체크 및 같은 위치/시간 체크
    const now = Date.now()
    if (now - lastLivingFetchTime.value < MIN_FETCH_INTERVAL && locationKey === lastLivingLocationKey.value && retryAttempt === 0) {
      return
    }

    isFetchingLiving.value = true
    isAnyFetching.value = true

    try {
      const uvIndexData: WeatherData = await $fetch(`https://apis.data.go.kr/1360000/LivingWthrIdxServiceV4/getUVIdxV4?serviceKey=${livingIndexQuery(currentLocationCode.value?.code ?? 0, genDateFormat('YYYYMMDDHH'))}`)
      const diffusionData: WeatherData = await $fetch(`https://apis.data.go.kr/1360000/LivingWthrIdxServiceV4/getAirDiffusionIdxV4?serviceKey=${livingIndexQuery(currentLocationCode.value?.code ?? 0, genDateFormat('YYYYMMDDHH'))}`)

      if (!uvIndexData.response || !uvIndexData.response.body || !uvIndexData.response.body.items.item[0] || !diffusionData.response || !diffusionData.response.body.items.item[0]) {
        return
      }

      recordLivingData(parseInt(uvIndexData.response.body.items.item[0].h0 ?? ''), parseInt(diffusionData.response.body.items.item[0].h3 ?? ''))
      lastLivingFetchTime.value = now
      lastLivingLocationKey.value = locationKey
      retryCount.value = 0
    }
    catch (error: any) {
      // 429 에러 처리 (Too Many Requests)
      if (error.status === 429 || error.statusCode === 429) {
        if (retryAttempt < MAX_RETRY) {
          const delay = RETRY_DELAY_BASE * Math.pow(2, retryAttempt) // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay))
          isFetchingLiving.value = false
          isAnyFetching.value = false
          return fetchLivingData(retryAttempt + 1)
        }
        console.warn('기상청 API 요청 제한 초과. 잠시 후 다시 시도해주세요.')
      }
      else {
        console.error('Living 데이터 조회 실패:', error)
      }
    }
    finally {
      isFetchingLiving.value = false
      isAnyFetching.value = false
    }
  }

  const fetchWeatherData = async (retryAttempt = 0): Promise<void> => {
    // 전역 요청 락 체크 (다른 API 호출 중이면 대기)
    if (isAnyFetching.value && retryAttempt === 0) {
      return
    }

    // 중복 요청 방지
    if (isFetchingWeather.value) {
      return
    }

    // 위치 키 생성 (같은 위치인지 확인)
    const locationKey = `${geoX.value}-${geoY.value}-${getForecastHour()}`
    // 최소 요청 간격 체크 및 같은 위치/시간 체크
    const now = Date.now()
    if (now - lastWeatherFetchTime.value < MIN_FETCH_INTERVAL && locationKey === lastLocationKey.value && retryAttempt === 0) {
      return
    }

    isFetchingWeather.value = true
    isAnyFetching.value = true

    try {
      const data: WeatherData = await $fetch(`https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${weatherQuery(genDateFormat('YYYYMMDD'), getForecastHour(), geoX.value ?? 0, geoY.value ?? 0)}`)

      if (!data.response || !data.response.body || !data.response.body.items || !data.response.body.items.item) {
        return
      }

      recordWeatherData(data.response.body.items.item as WeatherItem[])
      lastWeatherFetchTime.value = now
      lastLocationKey.value = locationKey
      retryCount.value = 0
    }
    catch (error: any) {
      // 429 에러 처리 (Too Many Requests)
      if (error.status === 429 || error.statusCode === 429) {
        if (retryAttempt < MAX_RETRY) {
          const delay = RETRY_DELAY_BASE * Math.pow(2, retryAttempt) // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay))
          isFetchingWeather.value = false
          isAnyFetching.value = false
          return fetchWeatherData(retryAttempt + 1)
        }
        console.warn('기상청 API 요청 제한 초과. 잠시 후 다시 시도해주세요.')
      }
      else {
        console.error('날씨 데이터 조회 실패:', error)
      }
    }
    finally {
      isFetchingWeather.value = false
      isAnyFetching.value = false
    }
  }

  const recordLivingData = (uvKey: number, diffusionKey: number) => {
    uvData.value = {
      location: currentLocationCode.value?.firstLoc.concat(' ', currentLocationCode.value?.secondLoc) ?? '',
      uv: loadLivingData(uvKey, 'uv'),
      uvIndex: uvKey,
    }

    airDiffusionData.value = {
      location: currentLocationCode.value?.firstLoc.concat(' ', currentLocationCode.value?.secondLoc) ?? '',
      diffusion: loadLivingData(diffusionKey, 'diffusion'),
      diffusionIndex: diffusionKey,
    }
  }

  const recordWeatherData = (response: WeatherItem[]) => {
    weatherFirstData.value = {
      sky: getWeatherData('sky', filterWeatherData(response, 'SKY', 0)?.fcstValue ?? 0) ?? '',
      t1h: getWeatherData('t1h', filterWeatherData(response, 'T1H', 0)?.fcstValue ?? 0) ?? '',
      vec: getWeatherData('vec', Math.floor((parseInt(filterWeatherData(response, 'VEC', 0)?.fcstValue ?? '0') + 22.5) / 45)) ?? '',
      wsd: getWeatherData('wsd', filterWeatherData(response, 'WSD', 0)?.fcstValue ?? 0) ?? '',
    }

    weatherSecondData.value = {
      pty: getWeatherData('pty', filterWeatherData(response, 'PTY', 0)?.fcstValue ?? 0) ?? '',
      r1n: getWeatherData('r1n', filterWeatherData(response, 'RN1', 0)?.fcstValue ?? 0) ?? '',
      reh: getWeatherData('reh', filterWeatherData(response, 'REH', 0)?.fcstValue ?? 0) ?? '',
    }
  }

  const getWeatherData = (type: string, value: string | number) => {
    const data = weatherMapData[type]

    if (!data) {
      return undefined
    }

    return typeof data === 'function' ? data(value) : data[value as number]
  }

  const filterWeatherData = (data: WeatherItem[], category: string, index: number) => {
    return data.filter((item: WeatherItem) => item.category === category).at(index)
  }

  return {
    geoX,
    geoY,
    latitude,
    longitude,
    forecastHour,
    currentLocationCode,
    uvData,
    airDiffusionData,
    weatherFirstData,
    weatherSecondData,
    fetchLivingData,
    fetchWeatherData,
  }
}, {
  persist: {
    storage: piniaPluginPersistedstate.sessionStorage(),
  },
})
