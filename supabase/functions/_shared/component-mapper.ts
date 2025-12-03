import type { RAGContext, ComponentType } from './types.ts'
import { ALLOWED_COMPONENTS } from './types.ts'

// 키워드 매칭 헬퍼
const matchKeywords = (text: string, keywords: string[]): boolean => {
  const lowerText = text.toLowerCase()
  return keywords.some(keyword => lowerText.includes(keyword))
}

// 컴포넌트 타입 결정 로직
export const determineComponentType = (query: string, context: RAGContext): ComponentType => {
  // 인사 (최우선 처리 - 다른 조건보다 먼저 체크)
  const greetingKeywords = ['안녕', '하이', 'hi', 'hello', '반가워', '처음', '인사', '인사말', 'greeting', 'greetings']
  if (matchKeywords(query, greetingKeywords)) {
    return 'greeting-card'
  }

  // 스킬 (기술 관련 질문 최우선 처리)
  if (context.skills && context.skills.length > 0) {
    if (matchKeywords(query, ['기술', '스택', 'skill', 'stack', '프레임워크', '도구', 'framework', 'tool', '라이브러리', 'library', '기술적', '기술적인', '어떤 기술', '기술 고민', '기술 관심', '기술 역량', '기술 능력', '기술 스택', '사용 기술', '사용하는 기술', '어떤 스택', '어떤 도구', '어떤 프레임워크'])) {
      return 'skill-card'
    }
  }

  // 종합적인 질문 → profile-card 사용 (스킬 키워드가 없을 때만)
  if (matchKeywords(query, ['어떤 개발자', '어떤 사람', '종합적', '특징'])) {
    // '강점'은 기술 맥락일 수 있으므로 제외
    return 'contact-form'
  }

  // 프로젝트 (명시적인 키워드가 있으면 우선 처리)
  if (context.projects && context.projects.length > 0) {
    // 복수형 또는 여러 개를 의미하는 키워드가 있으면 project-list
    if (matchKeywords(query, ['프로젝트들', '프로젝트 목록', '모든 프로젝트', '전체 프로젝트', '프로젝트 리스트', '프로젝트 목록', 'projects', 'all projects', 'project list', 'project lists'])) {
      return 'project-list'
    }
    // 단일 프로젝트 또는 단수형 키워드 (보여주세요, 보여줘 등 요청 표현 포함)
    // '개발' 키워드는 기술 질문과 겹칠 수 있으므로 '프로젝트'와 함께 있을 때만 매칭
    if (matchKeywords(query, ['프로젝트', '토이프로젝트', '작업', '작품', '보여줘', '보여', '보기', '알려줘', '알려', '진행', '했던', '최근', 'project', 'made', 'portfolio', 'work', 'product', 'show', 'display', 'view', 'recent', 'tell'])) {
      // 프로젝트가 1개면 project-card, 여러 개면 project-carousel
      return context.projects.length === 1 ? 'project-card' : 'project-carousel'
    }
  }

  // 단점/부족한 점 (프로필보다 우선 처리)
  if (context.profile && context.profile.weaknesses && context.profile.weaknesses.length > 0) {
    if (matchKeywords(query, ['단점', '부족', '아쉬운', '개선', '약점', '한계', '어려움', 'weakness', 'weaknesses', 'improvement', 'limitation', 'challenge', 'difficulty', '부족한 점', '아쉬운 점', '개선점', '개선할 점'])) {
      return 'weaknesses-card'
    }
  }

  // 프로필
  if (context.profile) {
    if (matchKeywords(query, ['자기소개', '누구', '프로필', '소개', 'introduce', 'name', 'who', 'profile', 'introduction'])) {
      return 'profile-card'
    }
  }

  // 경력
  if (context.experience && context.experience.length > 0) {
    if (matchKeywords(query, ['이력', '타임라인', 'timeline', 'career'])) {
      return 'experience-timeline'
    }
    return 'experience-list'
  }

  // 스킬 (Fallback)
  if (context.skills && context.skills.length > 0) {
    return 'skill-radar'
  }

  // 프로젝트 (명시적 키워드가 없을 때 fallback)
  if (context.projects && context.projects.length > 0) {
    // 기본값: 여러 프로젝트가 있으면 carousel
    return 'project-carousel'
  }

  // 학력
  if (context.education && context.education.length > 0) {
    return 'education-card'
  }

  // 취미
  if (context.hobbies && context.hobbies.length > 0) {
    return 'hobby-carousel'
  }

  // 연락처 (소셜 링크보다 우선 처리)
  if (matchKeywords(query, ['연락', '컨택', '문의', '이메일', 'contact', 'inquiry', 'email', '메일'])) {
    return 'contact-form'
  }

  // 소셜 링크
  if (context.socialLinks && context.socialLinks.length > 0) {
    if (matchKeywords(query, ['소셜', '링크', '깃헙', 'github', '깃허브', '링크드인', 'linkedin', 'social', 'link', 'sns'])) {
      return 'social-links'
    }
  }

  // 이미지
  if (context.images && context.images.length > 0) {
    if (matchKeywords(query, ['앨범', '이미지', '사진', '전체', '이미지 아카이브', 'image', 'photo', 'all', 'archive'])) {
      return 'image-timeline'
    }
    if (matchKeywords(query, ['그리드', '모음', '갤러리', '앨범', 'grid', 'gallery', 'collection', 'album'])) {
      return 'image-grid'
    }
    return 'image-carousel'
  }

  // 기본값
  return 'chat-response'
}

// 컴포넌트 타입 유효성 검증
export const isValidComponentType = (type: string): type is ComponentType => {
  return ALLOWED_COMPONENTS.includes(type as ComponentType)
}
