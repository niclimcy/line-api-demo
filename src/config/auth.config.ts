import LINE from '@auth/express/providers/line'
import Google from '@auth/express/providers/google'
import Facebook from '@auth/express/providers/facebook'
import Credentials from '@auth/express/providers/credentials'
import { connectAuthDB } from '../db.js'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { comparePassword, hashPassword } from '../lib/passwordHelpers.js'
import { User } from '@auth/express'

const clientPromise = connectAuthDB()

export const authConfig = {
  trustHost: true,
  providers: [
    LINE({
      checks: ['state'],
    }),
    Google,
    Facebook,
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials, request) => {
        let user = null

        // Find user by email
        const db = (await clientPromise).db('bookstore')
        const userObj = await db.collection('emailusers').findOne({email: credentials.email})

        if (userObj) {
          const validPass = await comparePassword(credentials.password as string, userObj.password)
          if (validPass)
          {
            user = userObj as User
          }
        }

        // return user object with the their profile data
        return user
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
}
