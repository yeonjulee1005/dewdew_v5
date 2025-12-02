import type {
  ChatMessage,
  ComponentType,
  StreamMetadata,
  StreamTextChunk,
  ModelConfig,
} from '~/types/chat'
import { AVAILABLE_MODELS } from '~/types/chat'

type ComponentData = {
  type: ComponentType
  data: Record<string, any>
}

export const useChat = () => {
  const messages = ref<ChatMessage[]>([])
  const isStreaming = ref(false)
  const streamingText = ref('')
  const currentComponent = ref<{
    type: ComponentType
    data: Record<string, any>
  } | null>(null)

  // 모델 선택 상태
  const selectedModel = ref<ModelConfig>(AVAILABLE_MODELS[0]!)
  const availableModels = AVAILABLE_MODELS

  // 초기화 상태
  const isInitialized = ref(false)
  const initError = ref<Error | null>(null)

  // 스트리밍 중지용
  const abortController = ref<AbortController | null>(null)
  const currentReader = ref<ReadableStreamDefaultReader<Uint8Array> | null>(null)

  // 스트리밍 파싱 공통 함수
  const parseStreamResponse = async (
    response: Response,
    onText: (text: string) => void,
    onMetadata?: (type: ComponentType, data: Record<string, any>) => void,
  ) => {
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) throw new Error('No reader available')

    // reader 추적
    currentReader.value = reader

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(line => line.startsWith('data: '))

        for (const line of lines) {
          const jsonStr = line.slice(6).trim()
          if (jsonStr === '[DONE]') continue

          try {
            const parsed = JSON.parse(jsonStr) as StreamMetadata | StreamTextChunk

            if (parsed.type === 'metadata' && onMetadata) {
              const metadata = parsed as StreamMetadata
              if (metadata.componentType !== 'chat-response') {
                onMetadata(metadata.componentType, metadata.data)
              }
            }

            if (parsed.type === 'text') {
              onText((parsed as StreamTextChunk).content)
            }
          }
          catch {
            // JSON 파싱 실패 무시
          }
        }
      }
    }
    finally {
      currentReader.value = null
      reader.releaseLock()
    }
  }

  // 초기 인사 로드 (스트리밍)
  const loadGreeting = async () => {
    if (isInitialized.value || messages.value.length > 0) return

    isStreaming.value = true
    streamingText.value = ''
    currentComponent.value = null

    // AbortController 생성
    abortController.value = new AbortController()

    try {
      const response = await fetch('/api/chat/greeting', {
        signal: abortController.value.signal,
      })

      if (!response.ok) {
        throw new Error(`Greeting failed: ${response.status}`)
      }

      let componentType: ComponentType | null = null
      let componentData: Record<string, any> | null = null

      await parseStreamResponse(
        response,
        (text) => {
          streamingText.value += text
        },
        (type, data) => {
          componentType = type
          componentData = data
          currentComponent.value = { type, data }
        },
      )

      // 인사 메시지 저장
      messages.value.push({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: streamingText.value || '안녕하세요! 저는 이연주(듀듀)입니다. 무엇이 궁금하세요?',
        componentType,
        componentData,
        timestamp: new Date(),
      })

      isInitialized.value = true
    }
    catch (error) {
      // AbortError는 정상적인 중지이므로 무시
      if (error instanceof Error && error.name === 'AbortError') {
        // 중지된 경우 현재까지 받은 텍스트를 메시지로 저장
        if (streamingText.value.trim()) {
          const comp = currentComponent.value as ({ type: ComponentType, data: Record<string, any> } | null)
          messages.value.push({
            id: crypto.randomUUID(),
            role: 'assistant',
            content: streamingText.value,
            componentType: comp ? comp.type : null,
            componentData: comp ? comp.data : null,
            timestamp: new Date(),
          })
        }
        return
      }

      console.error('Greeting error:', error)
      initError.value = error as Error

      // 에러 시 기본 인사
      messages.value.push({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '안녕하세요! 저는 이연주(듀듀)입니다. 무엇이 궁금하세요?',
        componentType: null,
        componentData: null,
        timestamp: new Date(),
      })

      isInitialized.value = true
    }
    finally {
      isStreaming.value = false
      streamingText.value = ''
      currentComponent.value = null
      abortController.value = null
    }
  }

  // 상태 계산
  const status = computed(() => {
    if (isStreaming.value && !streamingText.value) {
      return 'submitted'
    }
    if (isStreaming.value && streamingText.value) {
      return 'streaming'
    }
    return 'ready'
  })

  const isLoading = computed(() => isStreaming.value)

  // 모델 변경
  const setModel = (model: ModelConfig) => {
    selectedModel.value = model
  }

  // 메시지 전송
  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isStreaming.value) return

    // 사용자 메시지 추가
    messages.value.push({
      id: crypto.randomUUID(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    })

    // 스트리밍 시작
    isStreaming.value = true
    streamingText.value = ''
    currentComponent.value = null

    // AbortController 생성
    abortController.value = new AbortController()

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages.value.slice(-10).map(m => ({
            role: m.role,
            content: m.content,
          })),
          modelProvider: selectedModel.value.provider,
          modelName: selectedModel.value.model,
        }),
        signal: abortController.value.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      let componentType: ComponentType | null = null
      let componentData: Record<string, any> | null = null

      await parseStreamResponse(
        response,
        (text) => {
          streamingText.value += text
        },
        (type, data) => {
          componentType = type
          componentData = data
          currentComponent.value = { type, data }
        },
      )

      // 어시스턴트 메시지 저장
      messages.value.push({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: streamingText.value,
        componentType,
        componentData,
        timestamp: new Date(),
      })
    }
    catch (error) {
      // AbortError는 정상적인 중지이므로 무시
      if (error instanceof Error && error.name === 'AbortError') {
        // 중지된 경우 현재까지 받은 텍스트를 메시지로 저장
        if (streamingText.value.trim()) {
          const comp = currentComponent.value as ComponentData | null
          messages.value.push({
            id: crypto.randomUUID(),
            role: 'assistant',
            content: streamingText.value,
            componentType: comp ? comp.type : null,
            componentData: comp ? comp.data : null,
            timestamp: new Date(),
          })
        }
        return
      }

      console.error('Chat error:', error)

      messages.value.push({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '죄송해요, 오류가 발생했어요. 다시 시도해주세요!',
        timestamp: new Date(),
      })
    }
    finally {
      isStreaming.value = false
      streamingText.value = ''
      currentComponent.value = null
      abortController.value = null
    }
  }

  // 스트리밍 중지
  const stop = () => {
    if (!isStreaming.value) return

    // AbortController로 요청 중단
    if (abortController.value) {
      abortController.value.abort()
    }

    // Reader 중단
    if (currentReader.value) {
      currentReader.value.cancel()
      currentReader.value.releaseLock()
      currentReader.value = null
    }

    // 상태 초기화는 catch 블록에서 처리됨
  }

  // 대화 초기화
  const clearMessages = () => {
    messages.value = []
    isInitialized.value = false
    initError.value = null
    loadGreeting()
  }

  // 컴포넌트 마운트 시 인사 로드
  onMounted(() => {
    loadGreeting()
  })

  return {
    messages,
    isStreaming,
    streamingText,
    currentComponent,
    status,
    isLoading,
    isInitialized,
    initError,
    selectedModel,
    availableModels,
    setModel,
    sendMessage,
    stop,
    clearMessages,
    loadGreeting,
  }
}
