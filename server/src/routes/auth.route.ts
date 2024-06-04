import { Router } from 'express'
import passport from 'passport'
import User from '../schemas/user.schema'

const url = process.env.FRONTEND_URL || 'http://localhost:3001'
const router = Router()

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

router.post(
  '/login/password',
  passport.authenticate('local', {
    successRedirect: url + '/',
    failureRedirect: url + '/login',
  })
)

export default router
