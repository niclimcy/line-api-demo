import express from 'express'
import { ExpressAuth } from '@auth/express'
import 'dotenv/config'
import path from 'node:path'
import { createServer } from 'node:http'

import { authConfig } from './config/auth.config'
import { currentSession } from './middleware/auth.middleware'
import { connectDB } from './db'
import { handleWS } from './lib/ws'
import indexRoute from './routes/index'
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
app.use('/', indexRoute)
app.use('/', lineRoute)
app.use('/', registerRoute)
app.use('/', userRoute)
app.use('/', uploadRoute)

// View engine setup
app.set('views', path.join(import.meta.dirname, '/views'))
app.set('view engine', 'ejs')

// If app is served through a proxy, trust the proxy to allow HTTPS protocol to be detected
app.set('trust proxy', true)

// Set session in res.locals
app.use(currentSession)

// authjs
app.use('/auth/*', ExpressAuth(authConfig))

// Serve static files like css stylesheet
app.use(express.static(path.join(import.meta.dirname, '/public')))

// connect to mongodb
connectDB()

// handle socketio connections
handleWS(httpServer)

// start the Express server
httpServer.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`)
})
