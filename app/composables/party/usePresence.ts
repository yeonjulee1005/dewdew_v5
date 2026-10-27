import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'

/**
 * 공유 상태 (클라이언트 전용)
 * 헤더·메뉴 등 여러 곳에서 동시에 사용해도 채널은 하나만 구독해 접속자가 중복 집계되지 않도록 함
 */
const count = ref<number>(0)
const isConnected = ref(false)
let client: SupabaseClient | null = null
let channel: RealtimeChannel | null = null
let subscribers = 0

/**
 * 도메인 기반 채널명 생성
 * @returns 채널명 (예: 'presence:localhost-4110', 'presence:www-dewdew-dev')
 */
const getChannelName = (): string => {
  return `presence:${window.location.host.replace(/:/g, '-').replace(/\./g, '-')}`
}

/**
 * Presence 채널 구독
 */
const connect = () => {
  // 이미 구독 중이면 중복 구독 방지
  if (channel || !client) {
    return
  }

  channel = client.channel(getChannelName(), {
    config: { presence: { key: crypto.randomUUID() } },
  })

  channel
    .on('presence', { event: 'sync' }, () => {
      count.value = Object.keys(channel?.presenceState() ?? {}).length
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        isConnected.value = true
        await channel?.track({ online_at: new Date().toISOString() })
      }
      else if (status === 'CLOSED' || status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        isConnected.value = false
      }
    })
}

/**
 * Presence 채널 구독 해제
 */
const disconnect = () => {
  if (channel) {
    client?.removeChannel(channel)
    channel = null
  }

  isConnected.value = false
  count.value = 0
}

/**
 * 페이지 가시성 변경 시 재구독 처리 (백그라운드 탭에서 연결이 끊긴 경우)
 */
const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible' && !isConnected.value) {
    disconnect()
    connect()
  }
}

/**
 * Supabase Realtime Presence를 사용한 실시간 접속자 수 추적 Composable
 *
 * @description
 * - PartyKit 호스팅 종료(2026-10-23)로 Supabase Realtime Presence로 전환
 * - 도메인 기반 채널명을 사용하여 환경별로 접속자 수를 분리합니다
 * - 테이블 없이 Realtime 서버 메모리에서만 추적합니다 (DB 저장 없음)
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
  // 클라이언트에서만 실행 (첫 사용처에서 구독, 마지막 사용처가 사라지면 해제)
  if (import.meta.client) {
    // 이벤트 핸들러 등 setup 밖에서도 쓸 수 있도록 setup 컨텍스트에서 클라이언트를 확보
    client ??= useSupabaseClient()

    onMounted(() => {
      subscribers += 1
      if (subscribers === 1) {
        connect()
        document.addEventListener('visibilitychange', handleVisibilityChange)
        window.addEventListener('beforeunload', disconnect)
      }
    })

    onUnmounted(() => {
      subscribers -= 1
      if (subscribers === 0) {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        window.removeEventListener('beforeunload', disconnect)
        disconnect()
      }
    })
  }

  return {
    count: readonly(count),
    isConnected: readonly(isConnected),
  }
}
