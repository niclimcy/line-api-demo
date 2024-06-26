import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'

const { Schema } = mongoose

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  emailVerified: {
    // TODO: timestamp or string?
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
  },
  provider: {
    type: String,
    required: true,
  },
})

userSchema.plugin(passportLocalMongoose)

// Save in the same collection as users created by authjs
export default mongoose.model('User', userSchema)
