/**
 * 기상청 API허브 관측자료 유틸리티
 * - 지상관측(ASOS) 시간자료: kma_sfctm2.php (1시간 주기)
 * - 자외선 관측자료: kma_sfctm_uv.php (10분 주기)
 * 응답은 EUC-KR 고정폭 텍스트(#START7777 ~ #7777END)이며, 전체 지점(stn=0)을 받아 캐싱합니다.
 */
import stations from '../data/kmaStations.json'

const KMA_APIHUB_URL = 'https://apihub.kma.go.kr/api/typ01/url'
const KST_OFFSET = 9 * 60 * 60 * 1000

interface KmaStation {
  id: number
  lat: number
  lon: number
  name: string
  location: string
}

export interface SfcObservation {
  stn: number
  tm: string
  windDirection: number | null
  windSpeed: number | null
  temperature: number | null
  humidity: number | null
  rainfall: number | null
  weatherCode: number | null
  cloudAmount: number | null
  visibility: number | null
}

export interface UvObservation {
  stn: number
  tm: string
  uvIndex: number | null
}

/**
 * KST 기준 YYYYMMDDHHmm 문자열 생성
 */
const formatKst = (date: Date) => {
  const kst = new Date(date.getTime() + KST_OFFSET)
  const pad = (value: number) => value.toString().padStart(2, '0')

  return `${kst.getUTCFullYear()}${pad(kst.getUTCMonth() + 1)}${pad(kst.getUTCDate())}${pad(kst.getUTCHours())}${pad(kst.getUTCMinutes())}`
}

/**
 * 관측 시각 후보 목록 (최신 → 과거)
 * @param intervalMinutes 관측 주기 (분)
 * @param delayMinutes 자료 생산 지연 시간 (분)
 * @param count 후보 개수
 */
export const kmaObservationTimes = (intervalMinutes: number, delayMinutes: number, count: number) => {
  const interval = intervalMinutes * 60 * 1000
  const base = Math.floor((Date.now() - delayMinutes * 60 * 1000 + KST_OFFSET) / interval) * interval - KST_OFFSET

  return Array.from({ length: count }, (_, index) => formatKst(new Date(base - index * interval)))
}

/**
 * 결측값을 null로 변환 (KMA 결측 표기: -9, -9.0, -999 등)
 * @param min 이 값보다 작으면 결측으로 간주 (기온처럼 음수가 유효한 경우 -50 사용)
 */
const toValue = (token: string | undefined, min = 0) => {
  const value = Number(token)
  return Number.isFinite(value) && value >= min ? value : null
}

const fetchKmaText = async (path: string, query: Record<string, string>) => {
  const { kmaApihubKey } = useRuntimeConfig()

  if (!kmaApihubKey) {
    throw createError({ statusCode: 500, statusMessage: 'KMA API key is not configured' })
  }

  const buffer = await $fetch<ArrayBuffer>(`${KMA_APIHUB_URL}/${path}`, {
    query: { ...query, help: '0', authKey: kmaApihubKey },
    responseType: 'arrayBuffer',
  })
  const text = new TextDecoder('euc-kr').decode(buffer)

  if (!text.includes('#START7777')) {
    throw createError({ statusCode: 502, statusMessage: 'Invalid KMA API response' })
  }

  return text
    .split('\n')
    .filter(line => line.trim() && !line.trimStart().startsWith('#'))
    .map(line => line.trim().split(/\s+/))
}

/**
 * 지상관측 시간자료 (전체 지점)
 * 컬럼: TM STN WD WS ... TA(11) TD HM(13) PV RN(15) ... WC(22) WP WW CA_TOT(25) ... VS(32) ...
 */
export const fetchSfcObservations = defineCachedFunction(async (tm: string): Promise<SfcObservation[]> => {
  const rows = await fetchKmaText('kma_sfctm2.php', { tm, stn: '0' })

  return rows.map(tokens => ({
    stn: Number(tokens[1]),
    tm: tokens[0] ?? tm,
    // 36방위(10° 단위) → 도
    windDirection: toValue(tokens[2], 1) !== null ? Number(tokens[2]) * 10 : null,
    windSpeed: toValue(tokens[3]),
    temperature: toValue(tokens[11], -50),
    humidity: toValue(tokens[13]),
    rainfall: toValue(tokens[15]),
    weatherCode: toValue(tokens[22]),
    cloudAmount: toValue(tokens[25]),
    // 10m 단위 → km
    visibility: toValue(tokens[32]) !== null ? Number(tokens[32]) / 100 : null,
  }))
}, {
  name: 'kma-sfc',
  maxAge: 60 * 60,
  getKey: (tm: string) => tm,
  // 아직 생산되지 않은 시각의 빈 응답은 캐싱하지 않음
  validate: entry => !!entry.value?.length,
})

/**
 * 자외선 관측자료 (전체 지점)
 * 컬럼: TM STN UVB UVA EUV UV-B(5) UV-A TEMP1 TEMP2
 */
export const fetchUvObservations = defineCachedFunction(async (tm: string): Promise<UvObservation[]> => {
  const rows = await fetchKmaText('kma_sfctm_uv.php', { tm, stn: '0' })

  return rows.map(tokens => ({
    stn: Number(tokens[1]),
    tm: tokens[0] ?? tm,
    uvIndex: toValue(tokens[5]),
  }))
}, {
  name: 'kma-uv',
  maxAge: 60 * 60,
  getKey: (tm: string) => tm,
  validate: entry => !!entry.value?.length,
})

/**
 * 좌표에서 가까운 순으로 지점 정렬
 */
export const sortStationsByDistance = (type: 'sfc' | 'uv' | 'aws', lat: number, lon: number): KmaStation[] => {
  const cosLat = Math.cos(lat * Math.PI / 180)
  const distance = (station: KmaStation) => (station.lat - lat) ** 2 + ((station.lon - lon) * cosLat) ** 2

  return [...stations[type]].sort((a, b) => distance(a) - distance(b))
}
