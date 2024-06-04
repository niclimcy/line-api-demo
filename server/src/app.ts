import express from 'express'
import 'dotenv/config'
import path from 'node:path'
import { createServer } from 'node:http'

import { connectDB } from './db'
import { handleWS } from './lib/ws'
import lineRoute from './routes/line.route'
import lineWebhookRoute from './routes/line.webhook.route'
import registerRoute from './routes/register.route'
import userRoute from './routes/user.route'
import uploadRoute from './routes/upload.route'

const PORT = 3000
const app = express()
const httpServer = createServer(app)

app.use('/webhook', lineWebhookRoute)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', lineRoute)
app.use('/', registerRoute)
app.use('/', userRoute)
app.use('/', uploadRoute)

// If app is served through a proxy, trust the proxy to allow HTTPS protocol to be detected
app.set('trust proxy', true)

// connect to mongodb
connectDB()

// handle socketio connections
handleWS(httpServer)

// start the Express server
httpServer.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`)
})
