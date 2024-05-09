import LINE from '@auth/express/providers/line'
import Google from '@auth/express/providers/google'
import Facebook from '@auth/express/providers/facebook'
import { connectAuthDB } from '../db.js'
import { MongoDBAdapter } from '@auth/mongodb-adapter'

const clientPromise = connectAuthDB()

export const authConfig = {
  trustHost: true,
  providers: [
    LINE({
      checks: ['state'],
    }),
    Google,
    Facebook
  ],
  adapter: MongoDBAdapter(clientPromise)
}
