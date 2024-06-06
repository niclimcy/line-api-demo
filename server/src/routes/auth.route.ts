import { Router } from 'express'
import passport from '../config/passport.config'

const FRONTEND_URL = process.env.FRONTEND_URL || ''

const router = Router()

router.post(
  '/login/password',
  passport.authenticate('local', {
    failureRedirect: FRONTEND_URL + '/login',
    successRedirect: FRONTEND_URL + '/',
  })
)

router.get('/login/federated/google', passport.authenticate('google'))

router.get(
  '/auth/callback/google',
  passport.authenticate('google', {
    failureRedirect: FRONTEND_URL + '/login',
    successRedirect: FRONTEND_URL + '/',
  })
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
