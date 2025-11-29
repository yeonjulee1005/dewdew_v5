// _shared/history-optimizer.ts (새 파일)

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// 토큰 절약을 위한 히스토리 최적화
export const optimizeHistory = (history: ChatMessage[], maxMessages: number = 6): ChatMessage[] => {
  if (history.length <= maxMessages) {
    return history
  }

  // 최근 N개만 유지
  const recentHistory = history.slice(-maxMessages)

  // 어시스턴트 메시지 압축 (긴 답변 요약)
  return recentHistory.map((msg) => {
    if (msg.role === 'assistant' && msg.content.length > 200) {
      return {
        role: msg.role,
        content: msg.content.slice(0, 150) + '...(생략)',
      }
    }
    return msg
  })
}

// 대화 맥락 요약 생성 (더 적극적인 최적화)
export const createContextSummary = (history: ChatMessage[]): string => {
  if (history.length === 0) return ''

  const topics = new Set<string>()

  history.forEach((msg) => {
    if (msg.role === 'user') {
      // 키워드 추출
      if (msg.content.includes('스킬') || msg.content.includes('기술')) topics.add('스킬')
      if (msg.content.includes('경력') || msg.content.includes('회사')) topics.add('경력')
      if (msg.content.includes('프로젝트')) topics.add('프로젝트')
      if (msg.content.includes('소개') || msg.content.includes('누구')) topics.add('자기소개')
      if (msg.content.includes('취미')) topics.add('취미')
      if (msg.content.includes('연락') || msg.content.includes('이메일')) topics.add('연락처')
    }
  })

  if (topics.size === 0) return ''

  return `[이전 대화 주제: ${Array.from(topics).join(', ')}]`
}
