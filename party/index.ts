import type * as Party from 'partykit/server'

type PresenceMessage = {
  type: 'presence'
  count: number
}

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`,
    )

    // 현재 접속자 수를 모든 클라이언트에 브로드캐스트
    this.broadcastPresence()
  }

  onClose(_conn: Party.Connection) {
    // 연결이 종료되면 접속자 수 업데이트
    this.broadcastPresence()
  }

  onMessage(message: string, sender: Party.Connection) {
    // 클라이언트가 접속자 수를 요청하는 경우
    if (message === 'getPresence') {
      this.broadcastPresence()
      return
    }

    // 기타 메시지 처리
    console.log(`connection ${sender.id} sent message: ${message}`)
  }

  /**
   * 현재 접속자 수를 모든 클라이언트에 브로드캐스트
   */
  private broadcastPresence() {
    const count = this.room.connections.size
    const message: PresenceMessage = {
      type: 'presence',
      count,
    }
    this.room.broadcast(JSON.stringify(message))
  }
}

Server satisfies Party.Worker
