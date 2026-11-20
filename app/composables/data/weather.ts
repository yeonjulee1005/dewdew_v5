import type { WeatherDataMapType, LivingDataMapType } from '~/types/weather'

// 라벨은 i18n 키(weather.*) — 표시 시점(AForecast)에 현재 언어 문구로 변환한다
export const useWeatherMapData = () => {
  const weatherMapData: WeatherDataMapType = {
    sky: {
      1: 'weather.sky.clear,i-wi-solar-eclipse',
      3: 'weather.sky.mostlyCloudy,i-wi-day-cloudy-windy',
      4: 'weather.sky.cloudy,i-wi-cloudy-windy',
    },
    t1h: (value: number | string) => `${value}`,
    vec: {
      0: 'weather.wind.n,i-wi-wind-direction-n',
      1: 'weather.wind.ne,i-wi-wind-direction-ne',
      2: 'weather.wind.ne,i-wi-wind-direction-ne',
      3: 'weather.wind.ne,i-wi-wind-direction-ne',
      4: 'weather.wind.e,i-wi-wind-direction-e',
      5: 'weather.wind.se,i-wi-wind-direction-se',
      6: 'weather.wind.se,i-wi-wind-direction-se',
      7: 'weather.wind.se,i-wi-wind-direction-se',
      8: 'weather.wind.s,i-wi-wind-direction-s',
      9: 'weather.wind.sw,i-wi-wind-direction-sw',
      10: 'weather.wind.sw,i-wi-wind-direction-sw',
      11: 'weather.wind.sw,i-wi-wind-direction-sw',
      12: 'weather.wind.w,i-wi-wind-direction-w',
      13: 'weather.wind.nw,i-wi-wind-direction-nw',
      14: 'weather.wind.nw,i-wi-wind-direction-nw',
      15: 'weather.wind.nw,i-wi-wind-direction-nw',
      16: 'weather.wind.n,i-wi-wind-direction-n',
    },
    wsd: (value: number | string) => `${value}m/s`,
    pty: {
      0: 'weather.pty.none,i-wi-day-sunny',
      1: 'weather.pty.rain,i-wi-rain',
      2: 'weather.pty.rainSnow,i-wi-day-rain-mix',
      3: 'weather.pty.snow,i-wi-snow',
      5: 'weather.pty.drizzle,i-wi-rain-wind',
      6: 'weather.pty.drizzleSnow,i-wi-rain-mix',
      7: 'weather.pty.snowFlurry,i-wi-snow-wind',
    },
    r1n: (value: number | string) => `${value}`,
    reh: (value: number | string) => `${value}`,
  }

  const visibilityMapData: LivingDataMapType = {
    0: 'weather.level.veryBad,streamline:smiley-emoji-terrified',
    1: 'weather.level.bad,streamline:smiley-grumpy',
    2: 'weather.level.normal,streamline:smiley-kiss',
    3: 'weather.level.good,streamline:smiley-sparks',
  }

  const uvMapData: LivingDataMapType = {
    0: 'weather.level.low,streamline:smiley-sparks',
    1: 'weather.level.low,streamline:smiley-sparks',
    2: 'weather.level.low,streamline:smiley-sparks',
    3: 'weather.level.normal,streamline:smiley-kiss',
    4: 'weather.level.normal,streamline:smiley-kiss',
    5: 'weather.level.normal,streamline:smiley-kiss',
    6: 'weather.level.high,streamline:smiley-grumpy',
    7: 'weather.level.high,streamline:smiley-grumpy',
    8: 'weather.level.veryHigh,streamline:smiley-emoji-terrified',
    9: 'weather.level.veryHigh,streamline:smiley-emoji-terrified',
    10: 'weather.level.veryHigh,streamline:smiley-emoji-terrified',
    11: 'weather.level.danger,streamline:skull-1',
    12: 'weather.level.danger,streamline:skull-1',
  }

  const loadLivingData = (index: number, type: string) => {
    if (type === 'uv') {
      return uvMapData[index] as string
    }
    else {
      return visibilityMapData[index] as string
    }
  }

  /**
   * 전운량(1/10) → 하늘상태 코드 (기상청 기준: 0~5 맑음, 6~8 구름많음, 9~10 흐림)
   */
  const skyCode = (cloudAmount: number) => {
    if (cloudAmount <= 5) return 1
    if (cloudAmount <= 8) return 3
    return 4
  }

  /**
   * 풍향(도) → 16방위 인덱스
   */
  const windDirectionIndex = (degree: number) => Math.floor((degree + 11.25) / 22.5) % 16

  /**
   * GTS 현재일기(WMO 4677) 및 강수량 → 강수형태 코드
   * 50~59 이슬비, 60~67 비, 68~69 비/눈, 70~79 눈, 80~84 소나기, 85~86 소낙눈, 87~99 소나기·뇌우
   */
  const precipitationCode = (weatherCode: number | null, rainfall: number | null) => {
    if (weatherCode !== null) {
      if (weatherCode >= 50 && weatherCode <= 59) return 5
      if (weatherCode >= 60 && weatherCode <= 67) return 1
      if (weatherCode >= 68 && weatherCode <= 69) return 2
      if (weatherCode >= 70 && weatherCode <= 79) return 3
      if (weatherCode >= 85 && weatherCode <= 86) return 7
      if (weatherCode >= 80) return 1
    }

    return rainfall !== null && rainfall > 0 ? 1 : 0
  }

  /**
   * 시정(km) → 단계 (10km 이상 좋음, 5km 이상 보통, 1km 이상 나쁨, 1km 미만 매우나쁨)
   */
  const visibilityLevel = (visibility: number) => {
    if (visibility >= 10) return 3
    if (visibility >= 5) return 2
    if (visibility >= 1) return 1
    return 0
  }

  return {
    weatherMapData,
    loadLivingData,
    skyCode,
    windDirectionIndex,
    precipitationCode,
    visibilityLevel,
  }
}
