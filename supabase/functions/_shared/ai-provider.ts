// AI Provider - 멀티 모델 지원 (OpenAI, Anthropic, Google)

export type ModelProvider = 'openai' | 'anthropic' | 'google'

export type OpenAIModel = 'gpt-5-mini' | 'gpt-5-nano' | 'gpt-4.1-nano' | 'o4-mini'
export type AnthropicModel = 'claude-sonnet-4-5-20250929' | 'claude-haiku-4-5-20251001'
export type GoogleModel = 'gemini-3-pro-preview' | 'gemini-2.5-flash' | 'gemini-2.5-flash-lite'

export type ModelName = OpenAIModel | AnthropicModel | GoogleModel

export interface ModelConfig {
  provider: ModelProvider
  model: ModelName
  temperature?: number
  maxTokens?: number
}

// API URL
const API_URLS = {
  openai: 'https://api.openai.com/v1/chat/completions',
  anthropic: 'https://api.anthropic.com/v1/messages',
  google: 'https://generativelanguage.googleapis.com/v1beta/models',
}

// API 키 가져오기
const getApiKey = (provider: ModelProvider): string => {
  const keyNameMap: Record<ModelProvider, string> = {
    openai: 'OPENAI_API_KEY',
    anthropic: 'ANTHROPIC_API_KEY',
    google: 'GOOGLE_GEMINI_API_KEY',
  }

  const keyName = keyNameMap[provider]
  const key = Deno.env.get(keyName)

  if (!key) {
    throw new Error(`Missing ${keyName} environment variable`)
  }
  return key
}

// OpenAI 스트리밍
const createOpenAIStream = async (
  model: string,
  messages: Array<{ role: string, content: string }>,
  systemPrompt: string,
  temperature: number,
  maxTokens: number,
): Promise<ReadableStream<Uint8Array>> => {
  const response = await fetch(API_URLS.openai, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getApiKey('openai')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      stream: true,
      temperature,
      max_completion_tokens: maxTokens,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI API error: ${response.status} - ${error}`)
  }

  return response.body!
}

// Anthropic 스트리밍
const createAnthropicStream = async (
  model: string,
  messages: Array<{ role: string, content: string }>,
  systemPrompt: string,
  temperature: number,
  maxTokens: number,
): Promise<ReadableStream<Uint8Array>> => {
  const response = await fetch(API_URLS.anthropic, {
    method: 'POST',
    headers: {
      'x-api-key': getApiKey('anthropic'),
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
      stream: true,
      temperature,
      max_tokens: maxTokens,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Anthropic API error: ${response.status} - ${error}`)
  }

  return response.body!
}

// Google Gemini 스트리밍
const createGoogleStream = async (
  model: string,
  messages: Array<{ role: string, content: string }>,
  systemPrompt: string,
  temperature: number,
  maxTokens: number,
): Promise<ReadableStream<Uint8Array>> => {
  const apiKey = getApiKey('google')
  const url = `${API_URLS.google}/${model}:streamGenerateContent?key=${apiKey}&alt=sse`

  // Google 형식으로 메시지 변환
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents,
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Google API error: ${response.status} - ${error}`)
  }

  return response.body!
}

// 통합 스트리밍 생성 함수
export const createAIChatStream = async (
  config: ModelConfig,
  messages: Array<{ role: string, content: string }>,
  systemPrompt: string,
): Promise<{ stream: ReadableStream<Uint8Array>, provider: ModelProvider }> => {
  const { provider, model, temperature = 0.7, maxTokens = 2500 } = config

  let stream: ReadableStream<Uint8Array>

  switch (provider) {
    case 'openai':
      stream = await createOpenAIStream(model, messages, systemPrompt, temperature, maxTokens)
      break

    case 'anthropic':
      stream = await createAnthropicStream(model, messages, systemPrompt, temperature, maxTokens)
      break

    case 'google':
      stream = await createGoogleStream(model, messages, systemPrompt, temperature, maxTokens)
      break

    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }

  return { stream, provider }
}

// 기본 모델 설정 가져오기
export const getDefaultModelConfig = (): ModelConfig => {
  const provider = (Deno.env.get('DEFAULT_MODEL_PROVIDER') || 'openai') as ModelProvider
  const model = (Deno.env.get('DEFAULT_MODEL_NAME') || 'gpt-4o-mini') as ModelName

  return { provider, model }
}
