// AI Provider — Vercel AI Gateway (OpenAI 호환 REST)
// OpenAI·Anthropic·Google 등 provider별 개별 호출을 Gateway 단일 엔드포인트로 통합한다.
// Edge Runtime 호환을 위해 SDK(npm:ai)를 쓰지 않고 fetch 로 호출한다
// (@vercel/oidc 가 import 시점에 os.hostname() 을 호출해 Deno 권한 오류가 난다).
// 필요 환경변수: AI_GATEWAY_API_KEY (Supabase secrets)

import type { AIModelId } from './ai-models.ts'
import { getFallbackModels } from './ai-models.ts'

const GATEWAY_BASE_URL = 'https://ai-gateway.vercel.sh/v1'
const MAX_OUTPUT_TOKENS = 2500

const getApiKey = (): string => {
  const apiKey = Deno.env.get('AI_GATEWAY_API_KEY')
  if (!apiKey) {
    throw new Error('Missing AI_GATEWAY_API_KEY environment variable')
  }
  return apiKey
}

export const gatewayFetch = async (path: string, body: unknown): Promise<Response> => {
  const response = await fetch(`${GATEWAY_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`AI Gateway error (${path}): ${response.status} - ${error.slice(0, 500)}`)
  }
  return response
}

export interface ChatStreamMessage {
  role: 'user' | 'assistant'
  content: string
}

/**
 * 텍스트 스트림 생성
 * - temperature 는 보내지 않는다 (최신 Claude·GPT-5 계열 일부가 미지원)
 * - 선택 모델 실패 시 Gateway가 폴백 모델을 순서대로 시도
 * - caching: 'auto' 로 고정 시스템 프롬프트 prefix 캐싱 (지원 provider 한정)
 */
export async function* createAIChatStream(
  model: AIModelId,
  messages: ChatStreamMessage[],
  systemPrompt: string,
): AsyncIterable<string> {
  const response = await gatewayFetch('/chat/completions', {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    stream: true,
    max_tokens: MAX_OUTPUT_TOKENS,
    providerOptions: {
      gateway: {
        models: getFallbackModels(model),
        caching: 'auto',
        tags: ['dewdew-rag-portfolio'],
      },
    },
  })

  const reader = response.body!.pipeThrough(new TextDecoderStream()).getReader()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += value
      // SSE 이벤트는 줄 단위. 마지막 미완성 줄은 다음 청크와 합친다
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const data = line.slice(6).trim()
        if (data === '[DONE]') return

        let parsed: any
        try {
          parsed = JSON.parse(data)
        }
        catch {
          continue
        }

        if (parsed.error) {
          throw new Error(`AI Gateway stream error (${model}): ${JSON.stringify(parsed.error).slice(0, 500)}`)
        }

        const content = parsed.choices?.[0]?.delta?.content
        if (content) yield content
      }
    }
  }
  finally {
    reader.releaseLock()
  }
}
