import { Router } from 'express'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as LineStrategy } from 'passport-line'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import User from '../schemas/user.schema'
import type { ObjectId } from 'mongoose'

declare global {
  namespace Express {
    interface User {
      _id: ObjectId
      name: string
    }
  }
}

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001'
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''
const LINE_CHANNEL_ID = process.env.LINE_CHANNEL_ID || ''
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || ''
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || ''
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || ''

const router = Router()

passport.use(User.createStrategy())

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/oauth2/redirect/google',
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
      callbackURL: 'http://localhost:3000/auth/callback/line',
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
      callbackURL: 'http://localhost:3000/auth/callback/facebook',
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
  let sessionUser = {
    _id: user._id,
    name: user.name,
  }

  done(null, sessionUser)
})

passport.deserializeUser((sessionUser: Express.User, done) => {
  // The sessionUser object is different from the user mongoose
  // collection

  // It is actually req.session.passport.user and comes from the
  // session collection
  done(null, sessionUser)
})

router.post(
  '/login/password',
  passport.authenticate('local', {
    successRedirect: FRONTEND_URL + '/',
    failureRedirect: FRONTEND_URL + '/login',
  })
)

router.get('/login/federated/google', passport.authenticate('google'))

router.get(
  '/auth/callback/google',
  passport.authenticate('google', {
    failureRedirect: FRONTEND_URL + '/login',
    failureMessage: true,
  }),
  function (req, res) {
    res.redirect(FRONTEND_URL + '/')
  }
)

router.get('/login/federated/line', passport.authenticate('line'))

router.get(
  '/auth/callback/line',
  passport.authenticate('line', {
    failureRedirect: FRONTEND_URL + '/login',
    successRedirect: FRONTEND_URL + '/',
  })
)

router.get('/login/federated/facebook', passport.authenticate('facebook'))

router.get(
  '/auth/callback/facebook',
  passport.authenticate('facebook', {
    failureRedirect: FRONTEND_URL + '/login',
    successRedirect: FRONTEND_URL + '/',
  })
)

// Logout route.
router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.redirect(FRONTEND_URL + '/')
  })
})

// Curent user route.
router.get('/current-user', (req, res) => {
  if (!req.user) {
    return res.status(400).send({ error: 'Not signed in!' })
  }

  return res.status(200).send(req.user)
})

export default router
