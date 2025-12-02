/**
 * UI 관련 유틸리티 함수들을 제공하는 컴포저블
 * 클립보드, 랜덤, 댓글명 생성 등의 기능을 제공합니다
 */

export const useUtils = () => {
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

  return {
    copyClipBoard,
    randomOrder,
  }
}
