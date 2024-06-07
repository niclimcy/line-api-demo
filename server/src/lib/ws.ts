import { Server as WSServer } from 'socket.io'
import type { Server, IncomingMessage } from 'node:http'
import { RequestHandler } from 'express'
import type { Session } from 'express-session'
import { ExpressUser } from '../config/passport.config'

interface SessionWithPassport extends Session {
  passport?: {
    user: ExpressUser
  }
}

interface IncomingMessageExtended extends IncomingMessage {
  session: SessionWithPassport
}

export function handleWS(
  httpServer: Server,
  sessionMiddleware: RequestHandler
) {
  const io = new WSServer(httpServer, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true,
    },
  })
  io.engine.use(sessionMiddleware)

  io.on('connection', async (socket) => {
    const request = socket.request as IncomingMessageExtended
    const userName = request.session.passport?.user.name ?? socket.id

    io.emit('chat message', userName + ' connected')

    socket.on('disconnect', () => {
      io.emit('chat message', userName + ' disconnected')
    })

    socket.on('chat message', (msg) => {
      io.emit('chat message', `${userName}: ${msg}`)
    })
  })
}
