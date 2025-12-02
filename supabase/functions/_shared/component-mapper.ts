import type { RAGContext, ComponentType } from './types.ts'
import { ALLOWED_COMPONENTS } from './types.ts'

// 키워드 매칭 헬퍼
const matchKeywords = (text: string, keywords: string[]): boolean => {
  const lowerText = text.toLowerCase()
  return keywords.some(keyword => lowerText.includes(keyword))
}

// 컴포넌트 타입 결정 로직
export const determineComponentType = (query: string, context: RAGContext): ComponentType => {
  // 인사
  if (matchKeywords(query, ['안녕', '하이', 'hi', 'hello', '반가워', '처음'])) {
    return 'greeting-card'
  }

  // 종합적인 질문 → profile-card 사용
  if (matchKeywords(query, ['어떤 개발자', '어떤 사람', '종합적', '특징', '강점'])) {
    return 'contact-form'
  }

  // 프로젝트 (명시적인 키워드가 있으면 우선 처리)
  if (context.projects && context.projects.length > 0) {
    // 복수형 또는 여러 개를 의미하는 키워드가 있으면 carousel
    if (matchKeywords(query, ['프로젝트들', '프로젝트 목록', '모든 프로젝트', '전체 프로젝트', 'projects', 'all projects', 'project list'])) {
      return 'project-list'
    }
    // 단일 프로젝트 또는 단수형 키워드 (보여주세요, 보여줘 등 요청 표현 포함)
    if (matchKeywords(query, ['프로젝트', '토이프로젝트', '개발', '작업', '작품', '보여줘', '보여', '보기', 'project', 'made', 'development', 'portfolio', 'work', 'product', 'show', 'display', 'view'])) {
      // 프로젝트가 1개면 project-card, 여러 개면 project-carousel
      return context.projects.length === 1 ? 'project-card' : 'project-carousel'
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

  // 스킬
  if (context.skills && context.skills.length > 0) {
    if (matchKeywords(query, ['기술', '스택', 'skill', 'stack', '프레임워크', '도구', 'framework', 'tool'])) {
      return 'skill-card'
    }
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
    return 'hobby-list'
  }

  // 소셜 링크
  if (context.socialLinks && context.socialLinks.length > 0) {
    return 'social-links'
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

  // 연락처
  if (matchKeywords(query, ['연락', '링크드인', 'github', '컨택', '문의', 'contact', 'contact', 'inquiry'])) {
    return 'contact-form'
  }

  // 기본값
  return 'chat-response'
}

// 컴포넌트 타입 유효성 검증
export const isValidComponentType = (type: string): type is ComponentType => {
  return ALLOWED_COMPONENTS.includes(type as ComponentType)
}
