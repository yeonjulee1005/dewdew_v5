// 허용된 컴포넌트 타입
export const ALLOWED_COMPONENTS = [
  'greeting-card',
  'profile-card',
  'experience-list',
  'experience-timeline',
  'skill-card',
  'skill-radar',
  'certification-card',
  'project-carousel',
  'education-card',
  'weaknesses-card',
  'hobby-carousel',
  'social-links',
  'contact-form',
  'image-carousel',
  'threejs-carousel',
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

// AI 모델 (Vercel AI Gateway 경유)
// 서버 허용 목록(supabase/functions/_shared/ai-models.ts)과 동기화한다.
export type ModelProvider = 'anthropic' | 'openai' | 'google' | 'xai'

export type ModelId
  = | 'anthropic/claude-haiku-5.5'
    | 'anthropic/claude-sonnet-5.5'
    | 'openai/gpt-5.6-luna'
    | 'google/gemini-3.5-flash-lite'
    | 'spacexai/grok-build-0.1'

// 선택 목록의 보조 설명 (i18n: ai.modelTier.*)
export type ModelTier = 'recommended' | 'premium' | 'fast' | 'light' | 'reasoning'

export interface ModelConfig {
  provider: ModelProvider
  model: ModelId
  label: string
  icon: string
  // 브랜드 컬러 (아이콘 색상)
  iconClass: string
  tier: ModelTier
}

// 사용 가능한 모델 목록 — 첫 번째 항목이 기본 모델
export const AVAILABLE_MODELS: ModelConfig[] = [
  { provider: 'anthropic', model: 'anthropic/claude-haiku-5.5', label: 'Claude Haiku 5.5', icon: 'i-simple-icons-claude', iconClass: 'text-[#D97757]', tier: 'recommended' },
  { provider: 'anthropic', model: 'anthropic/claude-sonnet-5.5', label: 'Claude Sonnet 5.5', icon: 'i-simple-icons-claude', iconClass: 'text-[#D97757]', tier: 'premium' },
  { provider: 'openai', model: 'openai/gpt-5.6-luna', label: 'GPT-5.6 Luna', icon: 'i-simple-icons-openai', iconClass: 'text-neutral-900 dark:text-neutral-100', tier: 'fast' },
  { provider: 'google', model: 'google/gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash-Lite', icon: 'i-simple-icons-googlegemini', iconClass: 'text-[#8E75B2]', tier: 'light' },
  { provider: 'xai', model: 'spacexai/grok-build-0.1', label: 'Grok Build 0.1', icon: 'i-simple-icons-x', iconClass: 'text-neutral-900 dark:text-neutral-100', tier: 'reasoning' },
]

export const DEFAULT_MODEL: ModelConfig = AVAILABLE_MODELS[0]!

// 초기 인사 응답
export interface GreetingResponse {
  id: string
  role: 'assistant'
  content: string
  componentType: ComponentType | null
  componentData: Record<string, any> | null
  timestamp: string
}
