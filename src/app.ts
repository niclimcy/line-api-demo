import express from 'express'
import { NextFunction, Request, Response } from 'express'
import indexRoute from './routes/index'
import lineRoute from './routes/line.route'
import registerRoute from './routes/register.route'
import userRoute from './routes/user.route'
import { ExpressAuth } from '@auth/express'
import 'dotenv/config'
import { authConfig } from './config/auth.config'
import { currentSession } from './middleware/auth.middleware'
import { connectDB } from './db'
import path from 'node:path'

const PORT = 3000
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', indexRoute)
app.use('/', lineRoute)
app.use('/', registerRoute)
app.use('/', userRoute)

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

// start the Express server
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`)
})
