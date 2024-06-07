import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as LineStrategy } from 'passport-line'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import User from '../schemas/user.schema'
import type { ObjectId } from 'mongoose'

export interface ExpressUser extends Express.User {
  _id: ObjectId
  name: string
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''
const LINE_CHANNEL_ID = process.env.LINE_CHANNEL_ID || ''
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || ''
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || ''
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || ''

passport.use(User.createStrategy())

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/callback/google',
      scope: ['profile'],
      state: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          username: profile.id,
          provider: 'google',
        })
        if (!user) {
          user = new User({
            username: profile.id,
            name: profile.displayName,
            registered: true,
            provider: 'google',
          })
          await user.save()
        }
        return done(null, user)
      } catch (err) {
        return done(err)
      }
    }
  )
)

passport.use(
  new LineStrategy(
    {
      channelID: LINE_CHANNEL_ID,
      channelSecret: LINE_CHANNEL_SECRET,
      callbackURL: '/auth/callback/line',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          username: profile.id,
          provider: 'line',
        })
        if (!user) {
          user = new User({
            username: profile.id,
            name: profile.displayName,
            registered: true,
            provider: 'line',
          })
          await user.save()
        }
        return done(null, user)
      } catch (err) {
        return done(err)
      }
    }
  )
)

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: '/auth/callback/facebook',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          username: profile.id,
          provider: 'facebook',
        })
        if (!user) {
          user = new User({
            username: profile.id,
            name: profile.displayName,
            registered: true,
            provider: 'facebook',
          })
          await user.save()
        }
        return done(null, user)
      } catch (err) {
        return done(err)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  const expressUser = user as ExpressUser

  const sessionUser = {
    _id: expressUser._id,
    name: expressUser.name,
  }

  done(null, sessionUser)
})

passport.deserializeUser((sessionUser: ExpressUser, done) => {
  // The sessionUser object is different from the user mongoose
  // collection

  // It is actually req.session.passport.user and comes from the
  // session collection
  done(null, sessionUser)
})

export default passport
