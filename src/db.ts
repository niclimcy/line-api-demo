import mongoose from 'mongoose'

export default function connectDB() {
  const url = 'mongodb://localhost/bookstore'

  try {
    mongoose.connect(url)
  } catch (err: any) {
    console.error(err.message)
    process.exit(1)
  }
  const dbConnection = mongoose.connection
  dbConnection.once('open', (_) => {
    console.log(`Database connected: ${url}`)
  })

  dbConnection.on('error', (err) => {
    console.error(`connection error: ${err}`)
  })
  return
}
