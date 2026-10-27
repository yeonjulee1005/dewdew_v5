/**
 * Weather Domain Types
 */

/**
 * /api/weather 응답 (기상청 API허브 지상관측·자외선 관측자료)
 */
export interface WeatherObservation {
  location: string
  observedAt: string
  temperature: number | null
  humidity: number | null
  windDirection: number | null
  windSpeed: number | null
  rainfall: number | null
  weatherCode: number | null
  cloudAmount: number | null
  visibility: number | null
  uvIndex: number | null
}

export interface WeatherDataMapType {
  [key: string]: {
    [key: number]: string
  } | ((value: number | string) => string)
}

export interface LivingDataMapType {
  [key: number]: string
}

export interface WeatherFirstData {
  sky: string
  t1h: string
  vec: string
  wsd: string
}

export interface WeatherSecondData {
  pty: string
  r1n: string
  reh: string
}

export interface UvData {
  location: string
  uv: string
  uvIndex: number
}

export interface VisibilityData {
  location: string
  visibility: string
  visibilityLevel: number
  visibilityKm: number
}
