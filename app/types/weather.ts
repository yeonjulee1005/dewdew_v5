/**
 * Weather Domain Types
 */

export interface WeatherItem {
  h0?: string
  h3?: string
  baseDate: string
  baseTime: string
  category: string
  fcstDate: string
  fcstTime: string
  fcstValue: string
  nx: string
  ny: string
}

interface CommonLivingInterface {
  [key: string]: string
  areaNo: string
  code: string
  date: string
  h3: string
  h6: string
  h9: string
  h12: string
  h15: string
  h18: string
  h21: string
  h24: string
  h27: string
  h30: string
  h33: string
  h36: string
  h39: string
  h42: string
  h45: string
  h48: string
  h51: string
  h54: string
  h57: string
  h60: string
  h63: string
  h66: string
  h69: string
  h72: string
  h75: string
}

export interface UvItem extends CommonLivingInterface {
  h0: string
}

export interface AirDiffusionItem extends CommonLivingInterface {
  h78: string
}

export interface WeatherData {
  response: {
    header: {
      resultCode: string
      resultMsg: string
    }
    body: {
      dataType: string
      items: {
        item: WeatherItem[] | AirDiffusionItem[] | UvItem[]
      }
      pageNo: number
      numOfRows: number
      totalCount: number
    }
  }
}

export interface WeatherDataMapType {
  [key: string]: {
    [key: number]: string
  } | ((value: number | string) => string)
}

export interface LivingDataMapType {
  [key: number]: {
    [key: number]: string
  }
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

export interface AirDiffusionData {
  location: string
  diffusion: string
  diffusionIndex: number
}

export interface KoreanLocationCode {
  code: number
  firstLoc: string
  secondLoc: string
  geoX: number
  geoY: number
}
