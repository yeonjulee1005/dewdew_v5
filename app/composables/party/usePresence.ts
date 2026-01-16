import PartySocket from 'partysocket'

/**
 * Presence 메시지 타입 정의
 */
type PresenceMessage = {
  type: 'presence'
  count: number
}

/**
 * 재연결 설정 상수
 */
const RECONNECT_DELAY = 3000 // 3초
const MAX_RECONNECT_ATTEMPTS = 5 // 최대 재연결 시도 횟수
const DEFAULT_PARTYKIT_HOST = 'dewdew-v5.yeonjulee1005.partykit.dev'

/**
 * PartyKit을 사용한 실시간 접속자 수 추적 Composable
 *
 * @description
 * - 도메인 기반 Room ID를 사용하여 환경별로 접속자 수를 분리합니다
 * - 자동 재연결 기능을 제공합니다
 * - 클라이언트 사이드에서만 동작합니다
 *
 * @example
 * ```vue
 * <script setup>
 * const { count, isConnected } = usePresence()
 * </script>
 * ```
 */
export const usePresence = () => {
  const count = ref<number>(0)
  const isConnected = ref(false)
  const socket = ref<PartySocket | null>(null)
  const reconnectTimer = ref<ReturnType<typeof setTimeout> | null>(null)
  const reconnectAttempts = ref(0)
  const isDisconnecting = ref(false)

  /**
   * 도메인 기반 Room ID 생성
   * @returns Room ID (예: 'localhost-4110', 'dev-dewdew-dev', 'dewdew-dev')
   */
  const getRoomId = (): string => {
    if (import.meta.client && typeof window !== 'undefined') {
      const host = window.location.host
      // 포트가 있으면 포함, 없으면 제외
      // localhost:4110 → localhost-4110
      // dev.dewdew.dev → dev-dewdew-dev
      // dewdew.dev → dewdew-dev
      return host.replace(/:/g, '-').replace(/\./g, '-')
    }
    return 'main' // 서버 사이드에서는 기본값
  }

  /**
   * PartyKit 서버 호스트명 추출 및 정규화
   * @description 환경 변수에서 전체 URL이 올 수 있으므로 호스트명만 추출합니다
   * @returns 정규화된 호스트명 (예: 'dewdew-v5.yeonjulee1005.partykit.dev')
   */
  const getPartyHost = (): string => {
    // 로컬 개발 서버를 사용하려면 환경 변수로 제어
    if (import.meta.env.DEV && import.meta.env.PARTYKIT_USE_LOCAL === 'true') {
      return '127.0.0.1:1999'
    }

    const config = useRuntimeConfig()
    let partyHost = config.public.partykitHost || DEFAULT_PARTYKIT_HOST

    // 환경 변수에 전체 URL이 들어온 경우 호스트명만 추출
    // 예: https://dewdew-v5.yeonjulee1005.partykit.dev → dewdew-v5.yeonjulee1005.partykit.dev
    if (partyHost.startsWith('http://') || partyHost.startsWith('https://')) {
      try {
        const url = new URL(partyHost)
        partyHost = url.host
      }
      catch {
        // URL 파싱 실패 시 그대로 사용
      }
    }

    // wss:// 또는 ws:// 제거 (이미 포함되어 있을 수 있음)
    partyHost = partyHost.replace(/^wss?:\/\//, '')

    return partyHost
  }

  /**
   * 재연결 타이머 정리
   */
  const clearReconnectTimer = () => {
    if (reconnectTimer.value) {
      clearTimeout(reconnectTimer.value)
      reconnectTimer.value = null
    }
  }

  /**
   * WebSocket 연결 성공 핸들러
   */
  const handleOpen = () => {
    isConnected.value = true
    reconnectAttempts.value = 0 // 재연결 성공 시 카운터 리셋
    // 연결 시 접속자 수 요청
    socket.value?.send('getPresence')
  }

  /**
   * WebSocket 메시지 수신 핸들러
   */
  const handleMessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data as string) as PresenceMessage
      if (data.type === 'presence') {
        count.value = data.count
      }
    }
    catch (error) {
      console.error('Failed to parse presence message:', error)
    }
  }

  /**
   * WebSocket 에러 핸들러
   */
  const handleError = (error: Event) => {
    console.error('PartyKit connection error:', error)
    isConnected.value = false
  }

  /**
   * WebSocket 연결 종료 핸들러
   */
  const handleClose = () => {
    isConnected.value = false

    // 의도적인 종료가 아닌 경우에만 재연결 시도
    if (!isDisconnecting.value && reconnectAttempts.value < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts.value += 1
      reconnectTimer.value = setTimeout(() => {
        if (!socket.value || socket.value.readyState === WebSocket.CLOSED) {
          connect()
        }
      }, RECONNECT_DELAY)
    }
    else if (reconnectAttempts.value >= MAX_RECONNECT_ATTEMPTS) {
      console.warn('PartyKit: Maximum reconnection attempts reached')
    }
  }

  /**
   * PartyKit 서버에 연결
   */
  const connect = () => {
    // 이미 연결되어 있으면 중복 연결 방지
    if (socket.value?.readyState === WebSocket.OPEN) {
      return
    }

    // 연결 중이면 대기
    if (socket.value?.readyState === WebSocket.CONNECTING) {
      return
    }

    try {
      const partyHost = getPartyHost()
      const roomId = getRoomId()

      // 기존 연결이 있으면 정리
      if (socket.value) {
        socket.value.close()
      }

      // PartySocket은 호스트명만 받고, 프로토콜은 자동으로 결정됨
      socket.value = new PartySocket({
        host: partyHost,
        room: roomId,
      })

      // 이벤트 리스너 등록
      socket.value.addEventListener('open', handleOpen)
      socket.value.addEventListener('message', handleMessage)
      socket.value.addEventListener('error', handleError)
      socket.value.addEventListener('close', handleClose)
    }
    catch (error) {
      console.error('Failed to create PartyKit connection:', error)
      isConnected.value = false
    }
  }

  /**
   * PartyKit 서버 연결 종료
   */
  const disconnect = () => {
    isDisconnecting.value = true
    clearReconnectTimer()

    if (socket.value) {
      socket.value.close()
      socket.value = null
    }

    isConnected.value = false
    count.value = 0
    reconnectAttempts.value = 0
    isDisconnecting.value = false
  }

  // 클라이언트에서만 실행
  if (import.meta.client) {
    onMounted(() => {
      connect()
    })

    onUnmounted(() => {
      disconnect()
    })

    // 페이지 가시성 변경 시 재연결 처리
    if (typeof document !== 'undefined') {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && !isConnected.value && !isDisconnecting.value) {
          reconnectAttempts.value = 0 // 재시도 카운터 리셋
          connect()
        }
      }

      onMounted(() => {
        document.addEventListener('visibilitychange', handleVisibilityChange)
      })

      onUnmounted(() => {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      })
    }
  }

  return {
    count: readonly(count),
    isConnected: readonly(isConnected),
    connect,
    disconnect,
  }
}
