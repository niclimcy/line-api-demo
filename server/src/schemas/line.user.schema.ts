import mongoose from 'mongoose'

const { Schema } = mongoose

const lineUserSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
})

export default mongoose.model('LineUser', lineUserSchema)
