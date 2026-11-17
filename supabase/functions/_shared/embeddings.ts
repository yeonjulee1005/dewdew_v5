// ============================================
// Embedding API 통합 모듈
// EmbeddingGemma, OpenAI 등 다양한 임베딩 제공자 지원
// ============================================

import { gatewayFetch } from './ai-provider.ts'

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
 * Vercel AI Gateway 경유 임베딩
 * 저장된 벡터(resume.document_embeddings)와 같은 공간을 유지하려면 모델·차원을 바꾸지 않는다.
 * 바꾸면 initialize-embeddings 로 전체 재임베딩이 필요하다.
 */
const EMBEDDING_DIMENSIONS = 768 // 데이터베이스 벡터 차원

const getGatewayEmbedding = async (
  model: 'openai/text-embedding-3-small' | 'google/text-embedding-005',
  text: string,
): Promise<number[]> => {
  const response = await gatewayFetch('/embeddings', {
    model,
    input: text,
    dimensions: EMBEDDING_DIMENSIONS,
  })
  const data = await response.json()
  const embedding: number[] | undefined = data.data?.[0]?.embedding

  if (!embedding || embedding.length !== EMBEDDING_DIMENSIONS) {
    throw new Error(`Unexpected embedding dimensions from ${model}: ${embedding?.length ?? 'none'}`)
  }
  return embedding
}

/**
 * OpenAI text-embedding-3-small (현재 인덱스·검색 기본 경로)
 */
const getOpenAIEmbedding = (text: string): Promise<number[]> =>
  getGatewayEmbedding('openai/text-embedding-3-small', text)

/**
 * Google text-embedding-005 (예비 경로 — 사용 시 재임베딩 필요)
 */
const getGeminiEmbedding = (text: string): Promise<number[]> =>
  getGatewayEmbedding('google/text-embedding-005', text)

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
        throw new Error(
          `Embedding generation failed: ${error instanceof Error ? error.message : String(error)}`,
          { cause: fallbackError },
        )
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
