#!/usr/bin/env node

/**
 * 기상청 API허브 지점정보 다운로드 스크립트
 * 지상(ASOS)·자외선 관측 지점의 위경도를 받아 server/data/kmaStations.json에 저장합니다.
 * 지점 목록은 거의 바뀌지 않으므로 런타임에 호출하지 않고 정적 JSON으로 사용합니다.
 *
 * 사용법: node --env-file=.env scripts/fetch-kma-stations.js
 */

import { writeFile, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')
const outputPath = join(rootDir, 'server', 'data', 'kmaStations.json')

const STATION_INFO_URL = 'https://apihub.kma.go.kr/api/typ01/url/stn_inf.php'

/**
 * stn_inf.php 응답(고정폭 텍스트)을 지점 배열로 변환
 * 컬럼: STN_ID LON LAT STN_SP HT ... STN_AD STN_KO STN_EN FCT_ID LAW_ID BASIN LAW_ADDR
 */
const parseStations = (text, type) => {
  return text
    .split('\n')
    .filter(line => line.trim() && !line.trimStart().startsWith('#'))
    .map((line) => {
      const tokens = line.trim().split(/\s+/)
      const [id, lon, lat] = tokens

      // SFC: 법정동 주소(시·도 시·군·구)를 지역명으로 사용
      // UV: 주소가 없으므로 지점명(STN_KO)을 사용
      const name = type === 'SFC' ? tokens[10] : tokens[5]
      // 영문명(STN_EN)이 비어 있는 지점이 있어 법정동코드(10자리) 다음 BASIN 뒤부터를 주소로 사용
      // 산지 지점은 주소 앞에 '(산지)' 접두어가 붙어 있어 제거
      const lawIdIndex = tokens.findIndex((token, index) => index > 10 && /^\d{10}$/.test(token))
      const address = type === 'SFC' && lawIdIndex > 0
        ? tokens.slice(lawIdIndex + 2).join(' ').replace(/^\(.+?\)/, '').split(' ')
        : []

      return {
        id: Number(id),
        lat: Number(lat),
        lon: Number(lon),
        name,
        location: address.length >= 2 ? address.slice(0, 2).join(' ') : name,
      }
    })
    .filter(station => Number.isFinite(station.id) && Number.isFinite(station.lat) && Number.isFinite(station.lon))
}

const fetchStations = async (type, authKey) => {
  const url = `${STATION_INFO_URL}?inf=${type}&stn=&help=0&authKey=${authKey}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`${type} 지점정보 요청 실패: ${response.status}`)
  }

  // API허브 텍스트 응답은 EUC-KR 인코딩
  const text = new TextDecoder('euc-kr').decode(await response.arrayBuffer())

  if (!text.includes('#START7777')) {
    throw new Error(`${type} 지점정보 응답 오류: ${text.slice(0, 200)}`)
  }

  return parseStations(text, type)
}

const main = async () => {
  const authKey = process.env.KMA_APIHUB_KEY

  if (!authKey) {
    console.error('❌ KMA_APIHUB_KEY 환경변수가 없습니다. node --env-file=.env 로 실행해주세요.')
    process.exit(1)
  }

  const [sfc, uv] = await Promise.all([
    fetchStations('SFC', authKey),
    fetchStations('UV', authKey),
  ])

  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify({ sfc, uv }, null, 2)}\n`)

  console.log(`✅ 지상 ${sfc.length}개 / 자외선 ${uv.length}개 지점 저장: ${outputPath}`)
}

main().catch((error) => {
  console.error('❌', error.message)
  process.exit(1)
})
