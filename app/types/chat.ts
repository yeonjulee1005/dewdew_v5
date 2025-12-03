// 허용된 컴포넌트 타입
export const ALLOWED_COMPONENTS = [
  'greeting-card',
  'profile-card',
  'experience-list',
  'experience-timeline',
  'skill-card',
  'skill-radar',
  'project-list',
  'project-carousel',
  'project-card',
  'education-card',
  'weaknesses-card',
  'hobby-carousel',
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

// AI 모델 타입 (멀티 모델 지원)
export type ModelProvider = 'openai' | 'anthropic' | 'google'

export type OpenAIModel = 'gpt-5-mini' | 'gpt-5-nano' | 'gpt-4.1-nano' | 'o4-mini'
export type AnthropicModel = 'claude-sonnet-4-5-20250929' | 'claude-haiku-4-5-20251001'
export type GoogleModel = 'gemini-3-pro-preview' | 'gemini-2.5-flash' | 'gemini-2.5-flash-lite'

export type ModelName = OpenAIModel | AnthropicModel | GoogleModel

export interface ModelConfig {
  provider: ModelProvider
  model: ModelName
  label: string
  icon: string
}

// 사용 가능한 모델 목록
export const AVAILABLE_MODELS: ModelConfig[] = [
  // OpenAI - GPT-5 계열 (최신)
  { provider: 'openai', model: 'gpt-5-mini', label: 'GPT-5 Mini', icon: 'i-simple-icons-openai' },
  { provider: 'openai', model: 'gpt-5-nano', label: 'GPT-5 Nano', icon: 'i-simple-icons-openai' },
  // Anthropic - Claude 4.5 계열 (최신)
  { provider: 'anthropic', model: 'claude-sonnet-4-5-20250929', label: 'Claude Sonnet 4.5', icon: 'i-simple-icons-anthropic' },
  // Google - Gemini 3 계열 (최신)
  { provider: 'google', model: 'gemini-3-pro-preview', label: 'Gemini 3 Pro', icon: 'i-simple-icons-googlegemini' },
  { provider: 'google', model: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', icon: 'i-simple-icons-googlegemini' },
]

// 초기 인사 응답
export interface GreetingResponse {
  id: string
  role: 'assistant'
  content: string
  componentType: ComponentType | null
  componentData: Record<string, any> | null
  timestamp: string
}
