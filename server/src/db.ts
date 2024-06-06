import mongoose from 'mongoose'

export function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/bookstore'

  try {
    mongoose.connect(MONGODB_URI)
  } catch (err: unknown) {
    console.error(err)
    process.exit(1)
  }
  const dbConnection = mongoose.connection
  dbConnection.once('open', () => {
    console.log(`Database connected: ${MONGODB_URI}`)
  })

  dbConnection.on('error', () => {
    console.error(`connection error: ${MONGODB_URI}`)
  })
  return
}
