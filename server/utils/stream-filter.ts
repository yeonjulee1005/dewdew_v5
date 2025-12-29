/**
 * 스트리밍 응답에서 민감한 정보를 필터링하는 유틸리티
 */

/**
 * 민감한 정보를 제거하는 함수
 * 화이트리스트 방식으로 필요한 필드만 허용
 */
export const sanitizeMetadata = (data: any): any => {
  if (!data || typeof data !== 'object') return {}

  const sanitized: any = {}

  // 프로필 데이터의 경우 필요한 필드만 허용
  if (data.profile) {
    const allowedProfileFields = ['full_name', 'title', 'avatar_url', 'location']
    const sanitizedProfile: any = {}
    for (const field of allowedProfileFields) {
      if (data.profile[field] !== undefined) {
        sanitizedProfile[field] = data.profile[field]
      }
    }
    sanitized.profile = sanitizedProfile
  }

  // 프로필 외의 다른 데이터는 구조만 유지하고 내용은 최소화
  // 예: experience, skills 등은 빈 배열이나 최소한의 정보만 전달
  for (const [key, value] of Object.entries(data)) {
    if (key === 'profile') {
      continue // 이미 처리됨
    }
    // 배열인 경우 빈 배열로 대체
    if (Array.isArray(value)) {
      sanitized[key] = []
    }
    // 객체인 경우 빈 객체로 대체
    else if (value && typeof value === 'object') {
      sanitized[key] = {}
    }
    // 기본값은 그대로 유지 (예: weaknesses 등)
    else {
      sanitized[key] = value
    }
  }

  return sanitized
}

/**
 * 스트림을 필터링하여 민감한 정보를 제거하는 함수
 */
export const filterStream = async (stream: ReadableStream): Promise<ReadableStream> => {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      let buffer = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          buffer += chunk

          // 완전한 라인만 처리
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) {
              // data: 접두사가 없는 라인은 그대로 전달
              controller.enqueue(encoder.encode(`${line}\n`))
              continue
            }

            const jsonStr = line.slice(6).trim()
            if (jsonStr === '' || jsonStr === '[DONE]') {
              controller.enqueue(encoder.encode(`${line}\n`))
              continue
            }

            try {
              const parsed = JSON.parse(jsonStr)

              // 메타데이터 타입인 경우 데이터를 완전히 제거하고 컴포넌트 타입만 전달
              if (parsed.type === 'metadata' && parsed.componentType) {
                // 민감한 정보를 완전히 제거하고 컴포넌트 타입만 전달
                const filtered = {
                  type: 'metadata',
                  componentType: parsed.componentType,
                  data: {}, // 빈 객체로 전달 (컴포넌트는 자체 API를 통해 데이터를 가져옴)
                }
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(filtered)}\n\n`))
              }
              else {
                // 메타데이터가 아닌 경우 그대로 전달
                controller.enqueue(encoder.encode(`${line}\n`))
              }
            }
            catch {
              // JSON 파싱 실패 시 원본 라인 그대로 전달
              controller.enqueue(encoder.encode(`${line}\n`))
            }
          }
        }

        // 버퍼에 남은 데이터 처리
        if (buffer.trim()) {
          controller.enqueue(encoder.encode(buffer))
        }

        controller.close()
      }
      catch (error) {
        controller.error(error)
      }
      finally {
        reader.releaseLock()
      }
    },
  })
}
