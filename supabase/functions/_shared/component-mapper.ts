import type { RAGContext, ComponentType } from './types.ts'
import { ALLOWED_COMPONENTS } from './types.ts'

// 키워드 매칭 헬퍼
const matchKeywords = (text: string, keywords: string[]): boolean => {
  const lowerText = text.toLowerCase()
  return keywords.some(keyword => lowerText.includes(keyword))
}

// 카테고리 타입 정의
type CategoryType = 'greeting' | 'contact' | 'comprehensive' | 'image' | 'skill' | 'project' | 'threejs' | 'weakness' | 'profile' | 'experience' | 'education' | 'certification' | 'hobby' | 'social' | 'fallback' | 'none'

// Fallback 컨텍스트 데이터 타입 정의
type FallbackContextType = 'skills' | 'projects' | 'threejs' | 'experience' | 'profile' | 'education' | 'certifications' | 'hobbies' | 'socialLinks' | 'images' | 'none'

// 카테고리 감지 (우선순위 순서대로 체크)
const detectCategory = (query: string, context: RAGContext): CategoryType => {
  // 1. 인사 (최우선)
  if (matchKeywords(query, ['안녕', '하이', 'hi', 'hello', '반가워', '처음', '인사', '인사말', 'greeting', 'greetings'])) {
    return 'greeting'
  }

  // 2. 연락처
  if (matchKeywords(query, ['연락', '커피쳇', '커피챗', '면접제안', '컨택', '문의', '이메일', 'contact', 'inquiry', 'email', '메일'])) {
    return 'contact'
  }

  // 3. 종합적인 질문
  if (matchKeywords(query, ['어떤 개발자', '어떤 사람', '종합적', '전체적', '특징', '한마디로', '요약', '정리'])) {
    return 'comprehensive'
  }

  // 4. 이미지 (프로젝트보다 먼저 체크 - "보여줘" 같은 일반 동사와 충돌 방지)
  if (matchKeywords(query, ['사진', '이미지', '갤러리', '아카이브', '앨범', 'image', 'gallery', 'archive', 'album'])) {
    return 'image'
  }

  // 5. 스킬
  if (matchKeywords(query, ['기술', '스택', 'skill', 'stack', '프레임워크', '도구', 'framework', 'tool', '라이브러리', 'library', '기술적', '기술적인', '어떤 기술', '기술 고민', '기술 관심', '기술 역량', '기술 능력', '기술 스택', '사용 기술', '사용하는 기술', '어떤 스택', '어떤 도구', '어떤 프레임워크', '스킬', '기여', '언어', '역량', '능력', 'skillset', '고민', '관심'])) {
    return 'skill'
  }

  // 6. 학력 (경력보다 먼저 체크 - "학력이 어떻게 되요" 같은 경우 충돌 방지)
  if (matchKeywords(query, ['학력', '학교', '졸업', '전공', '대학', '교육', 'education', 'school', 'graduate', 'major', 'university', '학력이', '학력은', '학력이 어떻게', '학력이 어떻게 되', '학력이 어떻게 되요', '학력이 어떻게 되나'])) {
    return 'education'
  }

  // 6-1. 인증서 (학력과 취미 사이에 추가)
  if (matchKeywords(query, ['인증서', '자격증', '인증', '증명서', '자격', 'certificate', 'certification', '자격증이', '자격증은', '인증서가', '인증서는', '보유한 자격증', '보유 자격증', '취득한 자격증'])) {
    return 'certification'
  }

  // 7. 경력 (프로젝트보다 먼저 체크 - "최근 경력" 같은 경우 충돌 방지)
  // "최근 경력", "경력이", "경력은" 같은 패턴도 명시적으로 체크
  // 단, "학력" 키워드가 있으면 제외
  if (matchKeywords(query, ['경력', '회사', '일', '직장', '커리어', '경험', '이직', 'career', 'company', 'job', 'work', 'experience', 'transition', '이력', '타임라인', 'timeline', '최근 경력', '경력이', '경력은', '어떻게 되', '어떻게 되요', '어떻게 되나']) && !matchKeywords(query, ['학력', '학교', '졸업', '전공', '대학', 'education', 'school', 'graduate', 'major', 'university'])) {
    return 'experience'
  }

  // 8. 소셜 링크 (프로젝트보다 먼저 체크 - "소셜 링크를 알려주세요" 같은 경우 충돌 방지)
  if (matchKeywords(query, ['소셜', '소셜 링크', '소셜링크', '링크', '깃헙', 'github', '깃허브', '링크드인', 'linkedin', 'social', 'link', 'sns', '링크인', '이력서', '커리어', '연결', '연락처', '연락 방법'])) {
    return 'social'
  }

  // 9. 프로젝트
  // 주의: "최근", "work" 같은 키워드는 경력 체크 후에만 매칭됨
  // "최근 경력" 같은 경우를 제외하기 위해 "최근" 단독 키워드는 제거하고 "최근 프로젝트" 같은 패턴만 체크
  // "소셜 링크" 같은 경우를 제외하기 위해 "링크" 단독 키워드는 제거하고 "프로젝트 링크" 같은 패턴만 체크
  if (matchKeywords(query, ['프로젝트', '토이프로젝트', '작업', '작품', '보여줘', '보여', '보기', '진행', '했던', '최근 프로젝트', '최근 진행', 'project', 'made', 'portfolio', 'product', 'show', 'display', 'view', 'recent project', 'tell'])) {
    // "알려줘", "알려"는 소셜 링크가 아닐 때만 프로젝트로 매칭
    if (matchKeywords(query, ['알려줘', '알려']) && !matchKeywords(query, ['소셜', '링크', 'social', 'link', 'sns', '깃헙', 'github', 'linkedin'])) {
      return 'project'
    }
    // 다른 프로젝트 키워드가 있으면 프로젝트
    if (matchKeywords(query, ['프로젝트', '토이프로젝트', '작업', '작품', '진행', '했던', '최근 프로젝트', '최근 진행', 'project', 'made', 'portfolio', 'product', 'recent project'])) {
      return 'project'
    }
  }

  // 10. Three.js 작업물 (프로젝트 카테고리 이후 체크)
  if (matchKeywords(query, ['three.js', 'threejs', 'three js', 'webgl', '3d', 'three.js 작업물', '웹gl', 'threejs 작업물', 'three.js 작품', 'threejs 작품', 'three.js 보여줘', 'threejs 보여줘', 'webgl 작업물', '3d 작업물', '3d 작품'])) {
    return 'threejs'
  }

  // 11. 단점/부족한 점
  if (matchKeywords(query, ['단점', '부족', '아쉬운', '개선', '약점', '한계', '어려움', 'weakness', 'weaknesses', 'improvement', 'limitation', 'challenge', 'difficulty', '부족한 점', '아쉬운 점', '개선점', '개선할 점'])) {
    return 'weakness'
  }

  // 12. 프로필
  if (matchKeywords(query, ['자기소개', '누구', '프로필', '소개', 'introduce', 'name', 'who', 'profile', 'introduction', '철학', '가치관', '성격', '장점', '강점', 'philosophy', 'value', 'personality', 'strength'])) {
    return 'profile'
  }

  // 13. 취미
  if (matchKeywords(query, ['취미', '관심사', '좋아하', '여가', '취향', 'hobby', 'interest', 'like', 'leisure'])) {
    return 'hobby'
  }

  // 14. Fallback: 컨텍스트 데이터 기반
  if (context.skills?.length || context.projects?.length || context.threejs?.length || context.experience?.length || context.profile || context.education?.length || context.certificates?.length || context.hobbies?.length || context.socialLinks?.length || context.images?.length) {
    return 'fallback'
  }

  return 'none'
}

// Fallback 컨텍스트 데이터 감지 (우선순위 순서대로 체크)
const detectFallbackContext = (context: RAGContext): FallbackContextType => {
  if (context.skills && context.skills.length > 0) {
    return 'skills'
  }
  if (context.projects && context.projects.length > 0) {
    return 'projects'
  }
  if (context.threejs && context.threejs.length > 0) {
    return 'threejs'
  }
  if (context.experience && context.experience.length > 0) {
    return 'experience'
  }
  if (context.profile) {
    return 'profile'
  }
  if (context.education && context.education.length > 0) {
    return 'education'
  }
  if (context.certificates && context.certificates.length > 0) {
    return 'certifications'
  }
  if (context.hobbies && context.hobbies.length > 0) {
    return 'hobbies'
  }
  if (context.socialLinks && context.socialLinks.length > 0) {
    return 'socialLinks'
  }
  if (context.images && context.images.length > 0) {
    return 'images'
  }
  return 'none'
}

// Fallback 컴포넌트 타입 결정
const getFallbackComponentType = (context: RAGContext): ComponentType => {
  const fallbackContext = detectFallbackContext(context)

  switch (fallbackContext) {
    case 'skills':
      return Math.random() < 0.5 ? 'skill-radar' : 'skill-card'
    case 'projects':
      return 'project-carousel'
    case 'threejs':
      return 'threejs-carousel'
    case 'experience':
      return Math.random() < 0.5 ? 'experience-list' : 'experience-timeline'
    case 'profile':
      return 'profile-card'
    case 'education':
      return 'education-card'
    case 'certifications':
      return 'certification-card'
    case 'hobbies':
      return 'hobby-carousel'
    case 'socialLinks':
      return 'social-links'
    case 'images':
      return 'image-carousel'
    case 'none':
    default:
      return 'chat-response'
  }
}

// 컴포넌트 타입 결정 로직
export const determineComponentType = (query: string, context: RAGContext): ComponentType => {
  const category = detectCategory(query, context)

  switch (category) {
    case 'greeting':
      return 'greeting-card'
    case 'contact':
      return 'contact-form'
    case 'comprehensive':
      return 'profile-card'
    case 'image':
      return 'image-carousel'
    case 'skill': {
      // 데이터가 있으면 skill-radar 또는 skill-card를 랜덤으로 반환
      if (context.skills && context.skills.length > 0) {
        return Math.random() < 0.5 ? 'skill-radar' : 'skill-card'
      }
      // 데이터가 없으면 skill-radar 반환
      return 'skill-radar'
    }
    case 'project': {
      return 'project-carousel'
    }
    case 'threejs':
      // threejs 키워드가 감지되었으면 항상 threejs-carousel 반환 (데이터는 컴포넌트에서 처리)
      return 'threejs-carousel'
    case 'weakness':
      return (context.profile?.weaknesses && context.profile.weaknesses.length > 0) ? 'weaknesses-card' : 'chat-response'
    case 'profile':
      return context.profile ? 'profile-card' : 'chat-response'
    case 'experience':
      if (context.experience && context.experience.length > 0) {
        return matchKeywords(query, ['이력', '타임라인', 'timeline']) ? 'experience-timeline' : 'experience-list'
      }
      // 데이터가 없어도 키워드가 있으면 experience-list 반환
      return Math.random() < 0.5 ? 'experience-list' : 'experience-timeline'
    case 'education':
      return (context.education && context.education.length > 0) ? 'education-card' : 'chat-response'
    case 'certification':
      return (context.certificates && context.certificates.length > 0) ? 'certification-card' : 'chat-response'
    case 'hobby':
      return (context.hobbies && context.hobbies.length > 0) ? 'hobby-carousel' : 'chat-response'
    case 'social':
      return (context.socialLinks && context.socialLinks.length > 0) ? 'social-links' : 'chat-response'
    case 'fallback':
      return getFallbackComponentType(context)
    case 'none':
    default:
      return 'chat-response'
  }
}

// 컴포넌트 타입 유효성 검증
export const isValidComponentType = (type: string): type is ComponentType => {
  return ALLOWED_COMPONENTS.includes(type as ComponentType)
}
