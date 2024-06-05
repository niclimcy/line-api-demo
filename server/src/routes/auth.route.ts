import { Router } from 'express'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
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
const router = Router()

passport.use(User.createStrategy())

// Configure Passport to use the Google strategy.
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
        let user = await User.findOne({ 'google.id': profile.id })
        if (!user) {
          user = new User({
            name: profile.displayName,
            google: {
              id: profile.id,
              displayName: profile.displayName,
            },
            registered: true,
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
  '/oauth2/redirect/google',
  passport.authenticate('google', {
    failureRedirect: FRONTEND_URL + '/login',
    failureMessage: true,
  }),
  function (req, res) {
    res.redirect(FRONTEND_URL + '/')
  }
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
