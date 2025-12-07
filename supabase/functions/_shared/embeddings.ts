// ============================================
// Embedding API 통합 모듈
// EmbeddingGemma, OpenAI 등 다양한 임베딩 제공자 지원
// ============================================

export type EmbeddingProvider = 'embeddinggemma' | 'openai' | 'gemini'

/**
 * EmbeddingGemma를 통한 텍스트 임베딩 생성
 * Hugging Face Inference API 사용
 */
export const getEmbeddingGemmaEmbedding = async (text: string): Promise<number[]> => {
  const hfToken = Deno.env.get('HUGGINGFACE_API_KEY')

  if (!hfToken) {
    throw new Error('HUGGINGFACE_API_KEY is required for EmbeddingGemma')
  }

  try {
    // Hugging Face Router API 사용 (api-inference.huggingface.co는 더 이상 지원되지 않음)
    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/google/embeddinggemma-300m',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {
            source_sentence: text,
            sentences: [text], // SentenceSimilarityPipeline 형식에 맞춤
          },
          options: {
            wait_for_model: true, // 모델 로딩 대기
          },
        }),
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json() as any

    // Hugging Face 응답 형식 처리
    // SentenceSimilarityPipeline은 similarity score를 반환할 수 있으므로 확인 필요
    if (Array.isArray(data)) {
      // 배열 형식: number[][] 또는 number[]
      if (data.length > 0 && Array.isArray(data[0])) {
        // 2차원 배열: number[][] - 첫 번째 요소 반환
        const first = (data as number[][])[0]
        // similarity score가 아닌 embedding인지 확인 (384차원 벡터여야 함)
        if (Array.isArray(first) && first.length > 100) {
          return first
        }
      }
      // 1차원 배열: number[] - embedding인지 확인
      if (Array.isArray(data) && data.length > 100) {
        return data as number[]
      }
      // similarity score인 경우 (작은 배열) 오류 발생
      throw new Error('Received similarity score instead of embedding vector. This model may not support embedding generation via Inference API.')
    }

    // 객체 형식: { embeddings: number[][] } 또는 다른 형식
    if (typeof data === 'object' && data !== null) {
      if ('embeddings' in data) {
        const embeddings = data.embeddings
        if (Array.isArray(embeddings) && embeddings.length > 0) {
          const first = Array.isArray(embeddings[0]) ? embeddings[0] : embeddings
          if (Array.isArray(first) && first.length > 100) {
            return first
          }
        }
      }
      // 다른 객체 형식 시도
      const values = Object.values(data)
      if (values.length > 0 && Array.isArray(values[0])) {
        const firstValue = values[0]
        const embedding = Array.isArray(firstValue) ? firstValue : firstValue
        if (Array.isArray(embedding) && embedding.length > 100) {
          return embedding
        }
      }
    }

    throw new Error(`Unexpected response format from Hugging Face API: ${JSON.stringify(data).substring(0, 200)}`)
  }
  catch (error) {
    console.error('EmbeddingGemma API error:', error)
    throw error
  }
}

/**
 * OpenAI Embeddings API (폴백용)
 */
const getOpenAIEmbedding = async (text: string): Promise<number[]> => {
  const apiKey = Deno.env.get('OPENAI_API_KEY')

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required')
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
      dimensions: 768, // 데이터베이스 벡터 차원에 맞춤
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return data.data[0].embedding
}

/**
 * Google Gemini Embeddings API (폴백용)
 */
const getGeminiEmbedding = async (text: string): Promise<number[]> => {
  const apiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY')

  if (!apiKey) {
    throw new Error('GOOGLE_GEMINI_API_KEY is required')
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'models/text-embedding-004',
        content: { parts: [{ text }] },
      }),
    },
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return data.embedding.values
}

/**
 * 통합 임베딩 생성 함수
 * @param text - 임베딩할 텍스트
 * @param provider - 임베딩 제공자 (기본값: 'embeddinggemma')
 * @returns 임베딩 벡터 (number[])
 */
export const getEmbedding = async (
  text: string,
  provider: EmbeddingProvider = 'embeddinggemma',
): Promise<number[]> => {
  try {
    switch (provider) {
      case 'embeddinggemma':
        return await getEmbeddingGemmaEmbedding(text)
      case 'openai':
        return await getOpenAIEmbedding(text)
      case 'gemini':
        return await getGeminiEmbedding(text)
      default:
        throw new Error(`Unsupported provider: ${provider}`)
    }
  }
  catch (error) {
    // EmbeddingGemma 실패 시 OpenAI로 자동 폴백
    if (provider === 'embeddinggemma') {
      console.warn('EmbeddingGemma failed, falling back to OpenAI:', error)
      try {
        return await getOpenAIEmbedding(text)
      }
      catch (fallbackError) {
        console.error('OpenAI fallback also failed:', fallbackError)
        throw new Error(`Embedding generation failed: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
    throw error
  }
}

/**
 * 벡터를 PostgreSQL 배열 형식으로 변환
 * @param vector - 임베딩 벡터
 * @returns PostgreSQL 배열 형식 문자열
 */
export const vectorToArray = (vector: number[]): string => {
  return `[${vector.join(',')}]`
}
