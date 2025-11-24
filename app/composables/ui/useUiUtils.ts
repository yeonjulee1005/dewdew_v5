/**
 * UI 관련 유틸리티 함수들을 제공하는 컴포저블
 * 클립보드, 랜덤, 댓글명 생성 등의 기능을 제공합니다
 */

export const useUiUtils = () => {
  const { commentName } = useCommentName()

  /**
   * 클립보드에 텍스트 복사
   * @param value 복사할 텍스트
   * @returns Promise<void>
   * @example await copyClipBoard("복사할 텍스트")
   */
  const copyClipBoard = async (value: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value)
    }
    catch (err) {
      console.error('클립보드 복사에 실패했습니다.', err)
    }
  }

  /**
   * 0부터 지정된 숫자 미만의 랜덤 정수 생성
   * @param max 최대값 (미포함)
   * @returns 0 이상 max 미만의 랜덤 정수
   * @example randomOrder(10) // 0~9 중 하나
   */
  const randomOrder = (max: number): number => {
    return Math.floor(Math.random() * max)
  }

  /**
   * 랜덤 댓글 작성자명 생성
   * @returns 랜덤하게 조합된 댓글 작성자명
   * @example generateCommentName() // "친근한 사자"
   */
  const generateCommentName = (): string => {
    const frontName = commentName.frontName
    const backName = commentName.backName

    const randomFront = frontName[Math.floor(Math.random() * frontName.length)] ?? ''
    const randomBack = backName[Math.floor(Math.random() * backName.length)] ?? ''

    return randomFront.concat(' ', randomBack)
  }

  return {
    copyClipBoard,
    randomOrder,
    generateCommentName,
  }
}
