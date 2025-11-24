/**
 * 폼 입력값 검증을 위한 컴포저블
 * 이메일, 비밀번호, URL 등의 유효성을 검사합니다
 */

// 정규식 패턴 상수들
const EMAIL_REGEX = /^([0-9a-zA-Z_.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/
const HYPERLINK_REGEX = /(mailto:[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)|(((?:https?)|(?:ftp)):\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gm
const YOUTUBE_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|playlist\?|watch\?v=|watch\?.+(?:&|&#38;);v=))([a-zA-Z0-9\-_]{11})?(?:(?:\?|&|&#38;)index=((?:\d){1,3}))?(?:(?:\?|&|&#38;)?list=([a-zA-Z\-_0-9]{34}))?(?:\S+)?/g

export const useValidation = () => {
  /**
   * 이메일 주소 유효성 검사
   * @param email 검사할 이메일 주소
   * @returns 유효한 이메일인지 여부
   */
  const checkEmail = (email: string): boolean => {
    return !!EMAIL_REGEX.test(email)
  }

  /**
   * 비밀번호 유효성 검사
   * 8-16자, 영문+숫자+특수문자 포함
   * @param password 검사할 비밀번호
   * @returns 유효한 비밀번호인지 여부
   */
  const checkPassword = (password: string): boolean => {
    return !!PASSWORD_REGEX.test(password)
  }

  /**
   * 하이퍼링크 URL 유효성 검사
   * @param link 검사할 URL
   * @returns 유효한 URL인지 여부
   */
  const checkHyperLink = (link: string): boolean => {
    return !!HYPERLINK_REGEX.test(link)
  }

  /**
   * YouTube URL 유효성 검사
   * @param link 검사할 YouTube URL
   * @returns 유효한 YouTube URL인지 여부
   */
  const checkYoutubeLink = (link: string): boolean => {
    return !!YOUTUBE_REGEX.test(link)
  }

  /**
   * 정규식 패턴들을 직접 사용할 경우를 위해 export
   */
  const patterns = {
    email: EMAIL_REGEX,
    password: PASSWORD_REGEX,
    hyperlink: HYPERLINK_REGEX,
    youtube: YOUTUBE_REGEX,
  } as const

  return {
    checkEmail,
    checkPassword,
    checkHyperLink,
    checkYoutubeLink,
    patterns,
  }
}
