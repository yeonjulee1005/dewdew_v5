/**
 * 날짜/시간 포맷팅을 위한 컴포저블
 * dayjs를 활용한 다양한 날짜 형식 생성 및 변환 기능을 제공합니다
 */

export const useDateFormatter = () => {
  const dayjs = useDayjs()

  /**
   * 고유 ID 생성 (날짜 + 랜덤 문자열)
   * @returns 고유 ID 문자열
   * @example genUid() // "20241224_abc123def456"
   */
  const genUid = (): string => {
    const datePrefix = dayjs(new Date()).format('YYYYMMDD')
    const randomSuffix = Math.random().toString(36).substring(2, 16)
    return `${datePrefix}_${randomSuffix}`
  }

  /**
   * 파일명용 날짜 문자열 생성
   * @returns 파일명에 사용할 날짜 문자열
   * @example genFileDate() // "20241224_143052"
   */
  const genFileDate = (): string => {
    return dayjs(new Date()).format('YYYYMMDD_HHmmss')
  }

  /**
   * 지정된 형식으로 현재 날짜 포맷
   * @param format dayjs 형식 문자열
   * @returns 포맷된 날짜 문자열
   * @example genDateFormat("YYYY-MM-DD") // "2024-12-24"
   */
  const genDateFormat = (format: string): string => {
    return dayjs(new Date()).format(format)
  }

  /**
   * 1시간 전의 시간(시) 반환
   * @returns 1시간 전의 시간 문자열
   * @example getLastHour() // "13" (현재가 14시인 경우)
   */
  const getLastHour = (): string => {
    return dayjs(new Date()).subtract(1, 'hour').format('HH')
  }

  /**
   * 지정된 형식으로 현재 시간 반환
   * @param format 시간 형식 문자열
   * @returns 포맷된 시간 문자열
   * @example getMinute("HH:mm") // "14:30"
   */
  const getMinute = (format: string): string => {
    return dayjs(new Date()).format(format)
  }

  /**
   * 현재 날짜를 ISO 형식으로 변환 후 'T'로 분할
   * @returns ISO 날짜 문자열 배열 [날짜, 시간]
   * @example currentDateIosFormat() // ["2024-12-24", "14:30:00.000Z"]
   */
  const currentDateIosFormat = (): string[] => {
    return new Date().toISOString().split('T')
  }

  /**
   * 텍스트 읽기 시간 추정
   * @param text 읽을 텍스트
   * @returns 예상 읽기 시간 (분)
   * @example estimateReadingTime("Hello world...") // 1
   */
  const estimateReadingTime = (text: string): number => {
    const WORDS_PER_MINUTE = 225
    const words = text.trim().split(/\s+/).length
    return Math.ceil(words / WORDS_PER_MINUTE)
  }

  return {
    genUid,
    genFileDate,
    genDateFormat,
    getLastHour,
    getMinute,
    currentDateIosFormat,
    estimateReadingTime,
  }
}
