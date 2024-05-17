import { Server as WSServer } from 'socket.io'
import type { Server } from 'node:http'
import { getSession } from '@auth/express'
import { Request } from 'express'
import { authConfig } from './config/auth.config'

function mapToExpressReq(request: any) {
  return { headers: request.headers, protocol: 'http' }
}

export function handleWS(httpServer: Server) {
  const io = new WSServer(httpServer, {
    /* options */
  })

  io.on('connection', async (socket) => {
    const req = mapToExpressReq(socket.request) as Request
    const session = await getSession(req, authConfig)
    const userName = session?.user?.name ?? socket.id

    io.emit('chat message', userName + ' connected')

    socket.on('disconnect', () => {
      io.emit('chat message', userName + ' disconnected')
    })

    socket.on('chat message', (msg) => {
      io.emit('chat message', `${userName}: ${msg}`)
    })
  })
}
