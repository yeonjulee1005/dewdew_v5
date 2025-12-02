// ============================================
// Database Types (Supabase 스키마 기반)
// ============================================

export interface Profile {
  id: string
  full_name: string
  title: string | null
  bio: string | null
  avatar_url: string | null
  location: string | null
  email: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  company_name: string
  position: string
  description: string | null
  start_date: string
  end_date: string | null
  is_current: boolean
  location: string | null
  company_logo_url: string | null
  order_index: number | null
  created_at: string
}

export interface Skill {
  id: string
  category: string
  name: string
  proficiency: number | null
  icon_url: string | null
  order_index: number | null
  created_at: string
}

export interface Project {
  id: string
  title: string
  description: string | null
  tech_stack: string[] | null
  thumbnail_url: string | null
  thumbnail_blur_data_url: string | null
  project_url: string | null
  github_url: string | null
  start_date: string | null
  end_date: string | null
  highlights: string[] | null
  order_index: number | null
  created_at: string
}

export interface Education {
  id: string
  school_name: string
  degree: string | null
  major: string | null
  start_date: string | null
  end_date: string | null
  description: string | null
  order_index: number | null
  created_at: string
}

export interface Hobby {
  id: string
  title: string
  description: string | null
  icon_url: string | null
  order_index: number | null
  created_at: string
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon_url: string | null
  order_index: number | null
  created_at: string
}

export interface ImageArchive {
  id: string
  title: string
  description: string | null
  image_url: string
  thumbnail_url: string | null
  year: number
  month: number | null
  tags: string[] | null
  category: string | null
  order_index: number | null
  created_at: string
  updated_at: string
}

export interface AISetting {
  id: string
  setting_key: string
  setting_value: string
  created_at: string
  updated_at: string
}

// ============================================
// Component Types (허용된 컴포넌트만)
// ============================================

export const ALLOWED_COMPONENTS = [
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

// ============================================
// RAG Context (검색된 데이터)
// ============================================

export interface RAGContext {
  profile?: Profile | null
  experience?: Experience[] | null
  skills?: Skill[] | null
  projects?: Project[] | null
  education?: Education[] | null
  hobbies?: Hobby[] | null
  socialLinks?: SocialLink[] | null
  images?: ImageArchive[] | null
  imageYear?: number | null
  // 외부 프로필 데이터 (GitHub, LinkedIn 등)
  externalProfiles?: {
    github?: {
      profile: {
        login: string
        name: string | null
        bio: string | null
        company: string | null
        location: string | null
        public_repos: number
        followers: number
      } | null
      repos: Array<{
        name: string
        description: string | null
        language: string | null
        stargazers_count: number
        topics: string[]
      }>
      summary?: string
    }
    linkedin?: {
      available: boolean
      message: string
    }
  } | null
}

// ============================================
// AI Model Types (멀티 모델 지원)
// ============================================

export type ModelProvider = 'openai' | 'anthropic' | 'google'

export type OpenAIModel = 'gpt-4o-mini' | 'gpt-4o' | 'gpt-4-turbo' | 'gpt-3.5-turbo'
export type AnthropicModel = 'claude-3-5-sonnet-20241022' | 'claude-3-opus-20240229' | 'claude-3-haiku-20240307'
export type GoogleModel = 'gemini-1.5-pro' | 'gemini-1.5-flash' | 'gemini-2.0-flash-exp'

export type ModelName = OpenAIModel | AnthropicModel | GoogleModel

export interface ModelConfig {
  provider: ModelProvider
  model: ModelName
  temperature?: number
  maxTokens?: number
}

// ============================================
// API Types
// ============================================

export interface ChatRequest {
  message: string
  history?: ChatMessage[]
  modelProvider?: ModelProvider
  modelName?: ModelName
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface StreamMetadata {
  type: 'metadata'
  componentType: ComponentType
  data: RAGContext
}

export interface StreamTextChunk {
  type: 'text'
  content: string
}

export type StreamChunk = StreamMetadata | StreamTextChunk

// ============================================
// AI Settings Map
// ============================================

export interface AISettingsMap {
  owner_name?: string
  system_prompt?: string
  personality?: string
  speaking_style?: string
  language?: string
  fallback_message?: string
  greeting?: string
}
