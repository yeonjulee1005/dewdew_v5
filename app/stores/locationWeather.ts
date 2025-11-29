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

  const getForecastHour = () => {
    forecastHour.value = acceptableMinute() ? getLastHour().concat('00') : genDateFormat('HH').concat('00')
    return forecastHour.value
  }

  const acceptableMinute = () => {
    return parseInt(getMinute('mm')) < 35
  }

  const fetchLivingData = async () => {
    const uvIndexData: WeatherData = await $fetch(`https://apis.data.go.kr/1360000/LivingWthrIdxServiceV4/getUVIdxV4?serviceKey=${livingIndexQuery(currentLocationCode.value?.code ?? 0, genDateFormat('YYYYMMDDHH'))}`)
    const diffusionData: WeatherData = await $fetch(`https://apis.data.go.kr/1360000/LivingWthrIdxServiceV4/getAirDiffusionIdxV4?serviceKey=${livingIndexQuery(currentLocationCode.value?.code ?? 0, genDateFormat('YYYYMMDDHH'))}`)

    if (!uvIndexData.response || !uvIndexData.response.body || !uvIndexData.response.body.items.item[0] || !diffusionData.response || !diffusionData.response.body.items.item[0]) {
      return
    }

    recordLivingData(parseInt(uvIndexData.response.body.items.item[0].h0 ?? ''), parseInt(diffusionData.response.body.items.item[0].h3 ?? ''))
  }

  const fetchWeatherData = async () => {
    const data: WeatherData = await $fetch(`https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${weatherQuery(genDateFormat('YYYYMMDD'), getForecastHour(), geoX.value ?? 0, geoY.value ?? 0)}`)

    if (!data.response) {
      return
    }

    recordWeatherData(data.response.body.items.item as WeatherItem[])
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
