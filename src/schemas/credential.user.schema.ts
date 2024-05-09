import mongoose from 'mongoose'

const { Schema } = mongoose

const credentialUserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
})

export default mongoose.model('CredentialUser', credentialUserSchema)
