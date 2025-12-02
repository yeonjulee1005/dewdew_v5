// 허용된 컴포넌트 타입
export const ALLOWED_COMPONENTS = [
  'greeting-card',
  'profile-card',
  'experience-list',
  'experience-timeline',
  'skill-card',
  'skill-radar',
  'project-carousel',
  'project-card',
  'education-card',
  'hobby-list',
  'social-links',
  'image-carousel',
  'image-grid',
  'image-timeline',
  'contact-form',
  'chat-response',
] as const

export type ComponentType = typeof ALLOWED_COMPONENTS[number]

// 채팅 메시지
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  componentType?: ComponentType | null
  componentData?: Record<string, any> | null
  timestamp: Date
}

// 스트리밍 응답 타입
export interface StreamMetadata {
  type: 'metadata'
  componentType: ComponentType
  data: Record<string, any>
}

export interface StreamTextChunk {
  type: 'text'
  content: string
}

export type StreamChunk = StreamMetadata | StreamTextChunk

// 초기 인사 응답
export interface GreetingResponse {
  id: string
  role: 'assistant'
  content: string
  componentType: ComponentType | null
  componentData: Record<string, any> | null
  timestamp: string
}
