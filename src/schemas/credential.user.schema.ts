import mongoose from 'mongoose'

const { Schema } = mongoose

// This schema is for those registering with password
// TODO: decide on whether we should create a mega User schema for
// users who have completed the registration flow with all their details
const credentialUserSchema = new Schema({
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
    required: true,
  },
})

// Save in the same collection as users created by authjs
export default mongoose.model('User', credentialUserSchema)
