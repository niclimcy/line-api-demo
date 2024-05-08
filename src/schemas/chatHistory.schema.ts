import mongoose from 'mongoose'

const { Schema } = mongoose

const chatHistorySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  text: {
    type: String,
    required: true,
  },
})

export default mongoose.model('ChatHistory', chatHistorySchema)
