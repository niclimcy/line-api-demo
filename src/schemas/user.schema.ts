import mongoose from 'mongoose'

const { Schema } = mongoose

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  emailVerified: {
    // TODO: timestamp or string?
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  registered: {
    type: Boolean,
    required: false,
  }
})

// Save in the same collection as users created by authjs
export default mongoose.model('User', userSchema)
