/**
 * 데이터 포맷팅을 위한 컴포저블
 * 숫자, 문자열, HTML 등의 포맷팅 기능을 제공합니다
 */

// 정규식 패턴들
const UNCOMMA_REGEX = /(\d)(?=(?:\d{3})+(?!\d))/g
const COMMA_REGEX = /[^\d]+/g

export const useFormatter = () => {
  /**
   * 숫자에 콤마(,) 추가
   * @param value 포맷할 숫자
   * @returns 콤마가 추가된 문자열
   * @example comma(1234) // "1,234"
   */
  const comma = (value: number): string => {
    return String(value).replace(UNCOMMA_REGEX, '$1,')
  }

  /**
   * 문자열에서 콤마(,) 제거하여 숫자만 추출
   * @param value 콤마를 제거할 값
   * @returns 숫자만 포함된 문자열
   * @example uncomma("1,234") // "1234"
   */
  const uncomma = (value: number): string => {
    return String(value).replace(COMMA_REGEX, '')
  }

  /**
   * 문자열을 지정된 문자로 분할하여 첫 번째 부분만 반환
   * @param value 분할할 값
   * @param char 구분자 문자
   * @returns 분할된 첫 번째 문자열
   * @example splitByChar("hello.world", ".") // "hello"
   */
  const splitByChar = (value: string | number, char: string): string => {
    return String(value).split(char)[0] ?? ''
  }

  /**
   * 대소문자 구분 없이 문자열 포함 여부 검사
   * @param text 검색 대상 텍스트
   * @param search 찾을 문자열
   * @returns 포함 여부
   * @example textInclude("Hello World", "hello") // true
   */
  const textInclude = (text: string, search: string): boolean => {
    return text.toLowerCase().includes(search.toLowerCase())
  }

  /**
   * HTML 태그 제거
   * @param text HTML 태그가 포함된 텍스트
   * @returns HTML 태그가 제거된 텍스트
   * @example removeHtmlTags("<p>Hello</p><br>") // "Hello"
   */
  const removeHtmlTags = (text: string): string => {
    return text
      .replaceAll('<p>', '')
      .replaceAll('</p>', '')
      .replaceAll('<br>', '')
  }

  /**
   * 정규식 패턴들을 직접 사용할 경우를 위해 export
   */
  const patterns = {
    uncomma: UNCOMMA_REGEX,
    comma: COMMA_REGEX,
  } as const

  return {
    comma,
    uncomma,
    splitByChar,
    textInclude,
    removeHtmlTags,
    patterns,
  }
}
