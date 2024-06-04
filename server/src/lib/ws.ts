import { Server as WSServer } from 'socket.io'
import type { Server } from 'node:http'

export function handleWS(httpServer: Server) {
  const io = new WSServer(httpServer, {
    cors: {
      origin: '*',
    },
  })

  io.on('connection', async (socket) => {
    const userName = socket.id

    io.emit('chat message', userName + ' connected')

    socket.on('disconnect', () => {
      io.emit('chat message', userName + ' disconnected')
    })

    socket.on('chat message', (msg) => {
      io.emit('chat message', `${userName}: ${msg}`)
    })
  })
}
