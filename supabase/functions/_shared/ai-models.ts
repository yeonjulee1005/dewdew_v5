// AI 모델 카탈로그 — Vercel AI Gateway 경유
// 서버(Edge Function)가 허용하는 모델의 단일 기준(allowlist).
// 클라이언트가 보낸 모델명이 여기에 없으면 기본 모델로 대체한다 (고가 모델 임의 호출 방지).
// 프론트엔드 표시용 목록은 app/types/chat.ts 의 AVAILABLE_MODELS 와 동기화한다.

export const AI_MODEL_IDS = [
  'anthropic/claude-haiku-5.5',
  'anthropic/claude-sonnet-5.5',
  'openai/gpt-5.6-luna',
  'google/gemini-3.5-flash-lite',
  'spacexai/grok-build-0.1',
] as const

export type AIModelId = typeof AI_MODEL_IDS[number]

// 기본 모델: Claude 계열 중 비용 대비 성능 최적
export const DEFAULT_MODEL_ID: AIModelId = 'anthropic/claude-haiku-5.5'

// 기본 모델 장애 시 순서대로 시도할 폴백 (모두 저가 모델로 제한)
const FALLBACK_CHAIN: AIModelId[] = [
  'anthropic/claude-haiku-5.5',
  'openai/gpt-5.6-luna',
  'google/gemini-3.5-flash-lite',
]

export const isAllowedModel = (model: unknown): model is AIModelId =>
  typeof model === 'string' && (AI_MODEL_IDS as readonly string[]).includes(model)

// 요청 모델 → 허용 모델 (없거나 허용 목록 밖이면 기본 모델)
export const resolveModelId = (requested?: unknown): AIModelId => {
  if (isAllowedModel(requested)) return requested

  const envDefault = Deno.env.get('DEFAULT_MODEL_NAME')
  return isAllowedModel(envDefault) ? envDefault : DEFAULT_MODEL_ID
}

// 선택 모델을 제외한 폴백 목록
export const getFallbackModels = (primary: AIModelId): AIModelId[] =>
  FALLBACK_CHAIN.filter(model => model !== primary)
