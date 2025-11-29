const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

export const getOpenAIKey = (): string => {
  const key = Deno.env.get('OPENAI_API_KEY')
  if (!key) {
    throw new Error('Missing OPENAI_API_KEY environment variable')
  }
  return key
}

export interface OpenAIChatOptions {
  messages: Array<{ role: string, content: string }>
  systemPrompt: string
  model?: string
  temperature?: number
}

export const createChatStream = async (options: OpenAIChatOptions): Promise<ReadableStream<Uint8Array>> => {
  const { messages, systemPrompt, model = 'gpt-4o-mini', temperature = 0.7 } = options

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getOpenAIKey()}`,
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
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI API error: ${response.status} - ${error}`)
  }

  if (!response.body) {
    throw new Error('No response body from OpenAI')
  }

  return response.body
}
