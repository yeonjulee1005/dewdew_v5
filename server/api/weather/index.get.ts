/**
 * 현재 위치 기준 기상 관측 정보
 * 가장 가까운 지상관측(ASOS)·자외선 관측 지점의 최신 자료를 반환합니다.
 * 인증키는 서버에서만 사용하며, 관측자료는 전체 지점 단위로 캐싱합니다.
 */

// 국내 관측망 범위 (범위 밖이면 위젯을 표시하지 않음)
const KOREA_BOUNDS = { minLat: 33, maxLat: 39, minLon: 124, maxLon: 132 }

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const lat = Number(query.lat)
  const lon = Number(query.lon)

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw createError({ statusCode: 400, statusMessage: 'lat, lon are required' })
  }

  if (lat < KOREA_BOUNDS.minLat || lat > KOREA_BOUNDS.maxLat || lon < KOREA_BOUNDS.minLon || lon > KOREA_BOUNDS.maxLon) {
    return null
  }

  // 지상관측: 정시 자료가 10분 내외 지연되어 생산됨 → 최근 3개 시각 중 자료가 있는 시각 사용
  let sfcObservations: Awaited<ReturnType<typeof fetchSfcObservations>> = []
  for (const tm of kmaObservationTimes(60, 10, 3)) {
    sfcObservations = await fetchSfcObservations(tm)
    if (sfcObservations.length) break
  }

  // 자외선: 10분 주기, 20분 내외 지연 (실패해도 지상관측 자료는 반환)
  let uvObservations: Awaited<ReturnType<typeof fetchUvObservations>> = []
  try {
    for (const tm of kmaObservationTimes(10, 20, 3)) {
      uvObservations = await fetchUvObservations(tm)
      if (uvObservations.length) break
    }
  }
  catch (error) {
    console.warn('[weather] 자외선 관측자료 조회 실패:', error)
  }

  // 가까운 지점부터 유효한 기온 자료가 있는 지점 선택
  const sfcStation = sortStationsByDistance('sfc', lat, lon)
    .find(station => sfcObservations.some(item => item.stn === station.id && item.temperature !== null))
  const sfc = sfcObservations.find(item => item.stn === sfcStation?.id)

  const uvStation = sortStationsByDistance('uv', lat, lon)
    .find(station => uvObservations.some(item => item.stn === station.id && item.uvIndex !== null))
  const uv = uvObservations.find(item => item.stn === uvStation?.id)

  if (!sfcStation || !sfc) {
    return null
  }

  return {
    location: sfcStation.location,
    observedAt: sfc.tm,
    temperature: sfc.temperature,
    humidity: sfc.humidity,
    windDirection: sfc.windDirection,
    windSpeed: sfc.windSpeed,
    rainfall: sfc.rainfall,
    weatherCode: sfc.weatherCode,
    cloudAmount: sfc.cloudAmount,
    visibility: sfc.visibility,
    uvIndex: uv?.uvIndex ?? null,
  }
})
