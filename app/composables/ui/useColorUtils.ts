/**
 * 색상 관련 유틸리티 함수들을 제공하는 컴포저블
 * 날씨, 대기질, 습도 등의 값에 따른 색상 반환 기능을 제공합니다
 */

// 색상 상수들
const COLOR_CLASSES = {
  emerald: {
    500: 'text-emerald-500',
    600: 'text-emerald-600',
  },
  sky: {
    500: 'text-sky-500',
    600: 'text-sky-600',
  },
  orange: {
    300: 'text-orange-300',
    600: 'text-orange-600',
  },
  rose: {
    600: 'text-rose-600',
  },
  blue: {
    500: 'text-blue-500',
    600: 'text-blue-600',
  },
  yellow: {
    600: 'text-yellow-600',
  },
  red: {
    600: 'text-red-600',
  },
  teal: {
    500: 'text-teal-500',
  },
  stone: {
    500: 'text-stone-500',
  },
} as const

const _BADGE_COLORS = ['red', 'orange', 'yellow', 'emerald', 'teal', 'sky', 'cyan', 'violet', 'rose'] as const
const PROGRESS_COLORS = ['rose', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'red', 'rose'] as const

export const useColorUtils = () => {
  /**
   * 대기 확산 수치에 따른 색상 반환
   * @param airDiffusion 대기 확산 수치 (25, 50, 75, 100)
   * @returns Tailwind CSS 클래스명
   */
  const airDiffusionColor = (airDiffusion: number): string | undefined => {
    const colorMap: Record<number, string> = {
      25: COLOR_CLASSES.rose[600],
      50: COLOR_CLASSES.orange[600],
      75: COLOR_CLASSES.sky[600],
      100: COLOR_CLASSES.emerald[600],
    }
    return colorMap[airDiffusion]
  }

  /**
   * UV 지수에 따른 색상 반환
   * @param uv UV 지수
   * @returns Tailwind CSS 클래스명
   */
  const uvColor = (uv: number): string | undefined => {
    if (uv < 3) {
      return COLOR_CLASSES.emerald[600]
    }
    else if (uv >= 3 && uv < 6) {
      return COLOR_CLASSES.sky[600]
    }
    else if (uv >= 6 && uv < 8) {
      return COLOR_CLASSES.orange[600]
    }
    else if (uv >= 8 && uv < 11) {
      return COLOR_CLASSES.rose[600]
    }
    else if (uv >= 11) {
      return COLOR_CLASSES.red[600]
    }
  }

  /**
   * 습도에 따른 색상 반환
   * @param humidity 습도 (0-100)
   * @returns Tailwind CSS 클래스명
   */
  const humidityColor = (humidity: number): string | undefined => {
    if (humidity < 20) {
      return COLOR_CLASSES.stone[500]
    }
    else if (humidity >= 20 && humidity < 40) {
      return COLOR_CLASSES.emerald[500]
    }
    else if (humidity >= 40 && humidity < 60) {
      return COLOR_CLASSES.teal[500]
    }
    else if (humidity >= 60 && humidity < 80) {
      return COLOR_CLASSES.sky[500]
    }
    else if (humidity >= 80) {
      return COLOR_CLASSES.blue[500]
    }
  }

  /**
   * 날씨 상태에 따른 색상 반환
   * @param weather 날씨 상태 ("맑음", "구름 많음", "흐림")
   * @returns Tailwind CSS 클래스명
   */
  const weatherColor = (weather: string): string | undefined => {
    const colorMap: Record<string, string> = {
      '맑음': COLOR_CLASSES.yellow[600],
      '구름 많음': COLOR_CLASSES.sky[600],
      '흐림': COLOR_CLASSES.yellow[600],
    }
    return colorMap[weather]
  }

  /**
   * 온도에 따른 색상 반환
   * @param temperature 온도 문자열
   * @returns Tailwind CSS 클래스명
   */
  const temperatureColor = (temperature: string): string | undefined => {
    const temp = parseInt(temperature)

    if (temp >= 30) {
      return COLOR_CLASSES.orange[600]
    }
    else if (temp < 30 && temp >= 15) {
      return COLOR_CLASSES.orange[300]
    }
    else if (temp < 15 && temp >= 5) {
      return COLOR_CLASSES.sky[600]
    }
    else if (temp < 5) {
      return COLOR_CLASSES.blue[600]
    }
  }

  /**
   * 좋아요 수에 따른 배지 색상 반환
   * @param likeCount 좋아요 수
   * @returns 배지 색상명
   */
  const badgeColor = (likeCount: number): string => {
    if (likeCount === 0) return 'red'
    else if (likeCount > 0 && likeCount < 10) return 'orange'
    else if (likeCount >= 10 && likeCount < 20) return 'yellow'
    else if (likeCount >= 20 && likeCount < 50) return 'emerald'
    else if (likeCount >= 50 && likeCount < 100) return 'teal'
    else if (likeCount >= 100 && likeCount < 250) return 'sky'
    else if (likeCount >= 250 && likeCount < 500) return 'cyan'
    else if (likeCount >= 500 && likeCount < 1000) return 'violet'
    else return 'rose'
  }

  /**
   * 진행률에 따른 색상 반환
   * @param percent 진행률 (0-100)
   * @returns 색상명
   */
  const progressColor = (percent: number): string => {
    const index = Math.min(Math.floor(percent / 5), PROGRESS_COLORS.length - 1)
    return PROGRESS_COLORS[index] ?? 'rose'
  }

  return {
    airDiffusionColor,
    uvColor,
    humidityColor,
    weatherColor,
    temperatureColor,
    badgeColor,
    progressColor,
  }
}
