import { Server as WSServer } from 'socket.io'
import type { Server } from 'node:http'

export function handleWS(httpServer: Server) {
  const io = new WSServer(httpServer, {
    /* options */
  })

  io.on('connection', (socket) => {
    io.emit('chat message', socket.id + ' connected')

    socket.on('disconnect', () => {
      io.emit('chat message', socket.id + ' disconnected')
    })

    socket.on('chat message', (msg) => {
      io.emit('chat message', `${socket.id}: ${msg}`)
    })
  })
}
