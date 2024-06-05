import express from 'express'
import 'dotenv/config'
import { createServer } from 'node:http'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import morgan from 'morgan'

import { connectDB } from './db'
import { handleWS } from './lib/ws'
import lineRoute from './routes/line.route'
import lineWebhookRoute from './routes/line.webhook.route'
import registerRoute from './routes/register.route'
import userRoute from './routes/user.route'
import uploadRoute from './routes/upload.route'
import authRoute from './routes/auth.route'

const PORT = 3000
const app = express()
const httpServer = createServer(app)
const MONGODB_URI = process.env.MONGODB_URI || ''

// http request logger
app.use(morgan('tiny'))

// express-session
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true },
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
    }),
  })
)
app.use(passport.session())

app.use('/webhook', lineWebhookRoute)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', lineRoute)
app.use('/', registerRoute)
app.use('/', userRoute)
app.use('/', uploadRoute)
app.use('/', authRoute)

// If app is served through a proxy, trust the proxy to allow HTTPS protocol to be detected
app.set('trust proxy', true)

// connect to mongodb
connectDB()

// handle socketio connections
handleWS(httpServer)

// start the Express server
httpServer.listen(PORT, async () => {
  console.log(`Server running: http://localhost:${PORT}`)
})
