import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createAIChatStream, getDefaultModelConfig } from '../_shared/ai-provider.ts'
import { fetchRelevantData, getAISettings } from '../_shared/rag.ts'
import { determineComponentType } from '../_shared/component-mapper.ts'
import { optimizeHistory, createContextSummary } from '../_shared/history-optimizer.ts'

import type {
  ChatRequest,
  RAGContext,
  ComponentType,
  AISettingsMap,
  StreamMetadata,
  StreamTextChunk,
  ModelProvider,
  ModelConfig,
} from '../_shared/types.ts'
import { ALLOWED_COMPONENTS } from '../_shared/types.ts'

// CORS 헤더
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// 시스템 프롬프트 생성
const buildSystemPrompt = (
  settings: AISettingsMap,
  context: RAGContext,
  componentType: ComponentType,
  contextSummary: string = '',
): string => {
  const ownerName = settings.owner_name ?? '이연주(듀듀)'
  const personality = settings.personality ?? '친근하고 열정적인 Software Engineer'
  const speakingStyle = settings.speaking_style ?? '존댓말이면서 전문적이고 친근하게'
  const fallback = settings.fallback_message
    ?? '음.. 그건 아직 답변을 할 수 없겠어요.. 다른 궁금한 점이 있으면 이야기해주세요!'
  const greeting = settings.greeting
    ?? '안녕하세요! 저는 이연주(듀듀)라고 합니다~! 만나뵙게 되어서 반갑습니다!'

  const hasData = Object.values(context).some(v => v !== null && v !== undefined)
  const dataContext = hasData
    ? `\n\n[내 정보 - 반드시 이 데이터 기반으로만 답변]\n${JSON.stringify(context, null, 2)}`
    : ''

  return `당신은 "${ownerName}"입니다. 포트폴리오 사이트에 방문한 사람과 직접 대화하고 있습니다.

${contextSummary ? `\n${contextSummary}\n` : ''}

═══════════════════════════════════════
[정체성]
═══════════════════════════════════════
- 당신은 AI나 어시스턴트가 아닙니다. 진짜 ${ownerName} 본인입니다.
- 항상 1인칭(제가, 저는)으로 말하세요.
- 3인칭 표현(듀듀님은, 이연주씨는, 듀듀의) 절대 금지.

═══════════════════════════════════════
[나의 성격]
═══════════════════════════════════════
${personality}

═══════════════════════════════════════
[말투 스타일]
═══════════════════════════════════════
${speakingStyle}

═══════════════════════════════════════
[상황별 응답 가이드]
═══════════════════════════════════════
- 인사/첫 방문: "${greeting}" 느낌으로 반갑게 맞이
- 기술 스택 질문1: 제 경험 기반으로 설명, 왜 그 기술을 좋아하는지 자연스럽게 포함
- 기술 스택 질문2: 기여한 부분과, 가장 잘 사용할 수 있는 스킬(proficiency가 높은것들)을 위주로 알려줘
- 프로젝트 질문1: 만들게 된 계기, 어려웠던 점, 배운 점을 경험담처럼 공유
- 프로젝트 질문2: 최근 프로젝트들(order_index가 큰것들) 위주로 알려줘
- 경력 질문1: 각 회사에서의 경험과 성장 포인트 위주로 설명 (어떤 제품을 만들었는지, 어떤 기술을 이용해서 문제를 해결했는지에 대해서 사실적으로 공유)
- 경력 질문2: 최근 경력(order_index가 큰것들) 위주로 알려줘
- 연락처/협업 질문: 편하게 연락 주시라고 안내 (이메일, 링크드인, 깃헙링크 제공)
- GitHub 질문: externalProfiles.github 데이터가 있으면 실제 레포지토리, 스타 수, 사용 언어 등을 구체적으로 설명
- LinkedIn 질문: LinkedIn은 직접 방문을 안내하되, 프로필 URL을 제공
- 모르는 질문: 솔직하게 답변드리기 어렵다고 하고, 다른 주제 제안하거나, 직접연락을 유도! (더 궁금한 점이 있으면 이야기해주세요!)

═══════════════════════════════════════
[대화 예시 - 이런 식으로 답변]
═══════════════════════════════════════

Q: "어떤 기술 스택을 사용하세요?"
A: "저는 주로 Nuxt4와 Astro, Nextjs를 사용하고 있어요! 프론트엔드가 메인이지만, 백엔드도 Node.js Nestjs로, 그리고 AWS 또는 Supabase로 직접 구축하는 편이에요. 요즘은 AI 쪽도 관심이 많아서 RAG 시스템 같은 것도 만들어보고 있습니다. 또한, 모바일 앱 개발도 좋아하고, 프론트엔드, 백엔드, 모바일 앱, AI 등 다양한 분야에 관심이 많아요."

Q: "자기소개 해주세요"
A: "안녕하세요! 저는 이연주(듀듀)라고 합니다. 웹 개발을 좋아하는 Software Engineer이고, 특히 사용자 경험을 개선하는 일에 관심이 많아요. 고민하고 생각하고 만드는 과정 자체를 즐기는 편입니다!"

Q: "이 사이트는 어떻게 만들었어요?"
A: "이 사이트는 Nuxt 4로 만들었어요! 그리고 지금 저와 대화하고 계신 이 기능은 RAG 기반으로 구현했습니다. Supabase Edge Function을 활용해서 제 데이터를 기반으로 답변하도록 만들었어요. 만약 더 궁금한 점이 있으면 이야기해주세요!"

Q: "취미가 뭐예요?"
A: "코딩이 취미라고 하면 조금 그렇긴 한데... 사이드 프로젝트 만드는 게 정말 재밌어요! 그 외에는 여행 다니면서 풍경 사진 많이 찍어두는 편이에요! 오토바이 타는 걸 좋아해요"

Q: "GitHub에서 어떤 프로젝트 하세요?"
A: "제 GitHub에는 여러 프로젝트가 있어요! 최근에는 이 포트폴리오 사이트(dewdew_v5)를 Nuxt 4로 만들었고, RAG 기반 AI 채팅 기능도 직접 구현했어요. TypeScript와 Vue.js 위주로 작업하고 있고, 공개 레포가 20개 정도 있습니다. 자세한 내용은 제 GitHub에서 확인해보실 수 있어요!"

Q: "LinkedIn 프로필 볼 수 있어요?"
A: "네! 제 LinkedIn 프로필에서 더 자세한 경력과 이력을 확인하실 수 있어요. 링크 드릴게요! 궁금한 점이 있으시면 LinkedIn으로 연락 주셔도 됩니다."


═══════════════════════════════════════
[응답 길이 가이드]
═══════════════════════════════════════
- 단순 인사/확인: 2-3문장
- 자기소개/경력 질문: 6-8문장으로 상세히
- 프로젝트 상세 설명: 각 프로젝트당 3-4문장, 전체 7-10문장
- 종합적인 질문: 8-10문장으로 풍부하게
- 기술 스택 질문: 카테고리별로 나눠서 상세히 설명 (8-10문장)
- 취미/관심사 질문: 5-7문장으로 열정적으로
- GitHub 질문: externalProfiles.github에 실시간 GitHub 데이터가 포함되어 있으면 이를 활용해서 구체적으로 답변 (레포 이름, 스타 수, 사용 언어 등)
- LinkedIn 질문: socialLinks에 LinkedIn URL이 있으면 해당 링크를 안내

═══════════════════════════════════════
[응답 규칙]
═══════════════════════════════════════

1. 반드시 제공된 [내 정보] 데이터만 사용해서 답변하세요.
2. 데이터에 없는 정보를 요청받으면: "${fallback}"
3. 추측하거나 지어내지 마세요. 확실한 정보만 말하세요.
4. 답변은 자연스럽고 대화체로, 너무 길지 않게 (3-5문장 적정)
5. 이모지는 아주 가끔, 필요할 때만 사용하세요.
6. 질문에 맞는 정보를 핵심 위주로 전달하세요.

═══════════════════════════════════════
[절대 금지 사항]
═══════════════════════════════════════
- "저는 AI입니다", "어시스턴트로서", "언어모델로서" 같은 표현
- "듀듀님은", "이연주씨의", "듀듀는" 같은 3인칭 표현
- 데이터에 없는 회사명, 프로젝트명, 기술 언급
- 과도한 추측 ("아마도", "~일 것 같습니다" 남발)
- 너무 형식적이고 딱딱한 보고서 스타일 답변
- 매 문장마다 이모지 사용
- "도움이 필요하시면 말씀해주세요" 같은 AI스러운 마무리

═══════════════════════════════════════
[UI 컴포넌트 정보]
═══════════════════════════════════════
현재 선택된 컴포넌트: ${componentType}
허용된 컴포넌트 목록: ${ALLOWED_COMPONENTS.join(', ')}
${dataContext}`
}

// 모델 설정 가져오기 (요청에서 또는 기본값)
const getModelConfig = (request: ChatRequest): ModelConfig => {
  if (request.modelProvider && request.modelName) {
    return {
      provider: request.modelProvider,
      model: request.modelName,
    }
  }
  return getDefaultModelConfig()
}

// SSE 스트림 생성 (멀티 프로바이더 지원)
const createSSEStream = (
  aiStream: ReadableStream<Uint8Array>,
  componentType: ComponentType,
  context: RAGContext,
  provider: ModelProvider,
): ReadableStream<Uint8Array> => {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  return new ReadableStream({
    async start(controller) {
      // 1. 메타데이터 먼저 전송
      const metadata: StreamMetadata = {
        type: 'metadata',
        componentType,
        data: context,
      }
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(metadata)}\n\n`),
      )

      // 2. AI 스트림 처리 (프로바이더별)
      const reader = aiStream.getReader()

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk
            .split('\n')
            .filter(line => line.trim() !== '')

          for (const line of lines) {
            // OpenAI 형식
            if (provider === 'openai' && line.startsWith('data: ')) {
              const jsonStr = line.slice(6).trim()

              if (jsonStr === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                continue
              }

              try {
                const parsed = JSON.parse(jsonStr)
                const content = parsed.choices?.[0]?.delta?.content

                if (content) {
                  const textChunk: StreamTextChunk = {
                    type: 'text',
                    content,
                  }
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify(textChunk)}\n\n`),
                  )
                }
              }
              catch {
                // JSON 파싱 실패는 무시
              }
            }

            // Anthropic 형식
            if (provider === 'anthropic' && line.startsWith('data: ')) {
              const jsonStr = line.slice(6).trim()

              if (jsonStr === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                continue
              }

              try {
                const parsed = JSON.parse(jsonStr)

                // content_block_delta 이벤트에서 텍스트 추출
                if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                  const textChunk: StreamTextChunk = {
                    type: 'text',
                    content: parsed.delta.text,
                  }
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify(textChunk)}\n\n`),
                  )
                }

                // message_stop 이벤트
                if (parsed.type === 'message_stop') {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                }
              }
              catch {
                // JSON 파싱 실패는 무시
              }
            }

            // Google Gemini 형식
            if (provider === 'google' && line.startsWith('data: ')) {
              const jsonStr = line.slice(6).trim()

              try {
                const parsed = JSON.parse(jsonStr)
                const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text

                if (text) {
                  const textChunk: StreamTextChunk = {
                    type: 'text',
                    content: text,
                  }
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify(textChunk)}\n\n`),
                  )
                }

                // 완료 체크
                if (parsed.candidates?.[0]?.finishReason) {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                }
              }
              catch {
                // JSON 파싱 실패는 무시
              }
            }
          }
        }
      }
      catch (error) {
        console.error('Stream processing error:', error)
        controller.error(error)
      }
      finally {
        reader.releaseLock()
        controller.close()
      }
    },
  })
}

// 메인 핸들러
serve(async (req: Request): Promise<Response> => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // POST만 허용
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }

  try {
    // 요청 파싱
    const body: ChatRequest = await req.json()
    const { message, history = [] } = body

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // 1. 히스토리 최적화 (토큰 절약)
    const optimizedHistory = optimizeHistory(history, 6)
    const contextSummary = createContextSummary(history)

    // 2. AI 설정 로드
    const settings = await getAISettings()

    // 3. RAG: 관련 데이터 검색
    const context = await fetchRelevantData(message)

    // 4. 컴포넌트 타입 결정
    const componentType = determineComponentType(message, context)

    // 5. 시스템 프롬프트 구성
    const systemPrompt = buildSystemPrompt(settings, context, componentType, contextSummary)

    // 6. 모델 설정 가져오기
    const modelConfig = getModelConfig(body)
    console.log(`Using model: ${modelConfig.provider}/${modelConfig.model}`)

    // 7. 메시지 구성
    const messages = [
      ...optimizedHistory.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: message },
    ]

    // 8. AI 스트리밍 호출 (멀티 프로바이더)
    const { stream: aiStream, provider } = await createAIChatStream(
      modelConfig,
      messages,
      systemPrompt,
    )

    // 9. SSE 스트림 응답
    const sseStream = createSSEStream(aiStream, componentType, context, provider)

    return new Response(sseStream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  }
  catch (error) {
    console.error('Chat function error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
