import { Router, Request, Response } from 'express'
import { authenticatedUser } from '../middleware/auth.middleware.js'
import CredentialUser from '../schemas/user.schema.js'
import { hashPassword } from '../lib/passwordHelpers.js'

const router = Router()

router.post('/create-user', async (req: Request, res: Response) => {
  const { name, email, password, verifyPassword } = req.body

  // Check if passwords match
  if (password !== verifyPassword) {
    // Passwords don't match, render sign-up page with an error message
    return res.render('signup', { error: 'Passwords do not match' })
  }

  // Make sure password is not empty
  if (password.length < 8) {
    // Password empty or not long enough, render sign-up page with an error message
    return res.render('signup', { error: 'Password is too short' })
  }

  const hashPw = await hashPassword(password)

  // Find if an existing user with specified email already exists
  const existingUser = await CredentialUser.findOne({ email: email })
  if (existingUser) {
    return res.render('signup', { error: 'User already exists' })
  }

  try {
    const user = new CredentialUser({ email, password: hashPw, name })
    await user.save()
  } catch (error) {
    console.error(error)
    return res.status(500)
  }

  return res.redirect('/')
})

router.post('/get-otp', async (req: Request, res: Response) => {
  return res.status(200)
})

router.get(
  '/auth/register',
  authenticatedUser,
  (req: Request, res: Response) => {
    {
      if (!res.locals?.session) return res.redirect('/')
      const name = res.locals.session.user.name
      const email = res.locals.session.user.email ?? ''

      return res.render('register', { name, email, error: '' })
    }
  }
)

router.post(
  '/register-user',
  authenticatedUser,
  async (req: Request, res: Response) => {
    if (!res.locals?.session) return res.redirect('/')

    const { name, email, address, otp } = req.body

    // Function to match otp
    if (otp != '123456') {
      return res.render('register', { name, email, error: 'OTP Invalid' })
    }

    // Find if an existing user and update details
    const user = await CredentialUser.findOneAndUpdate(
      { email: email },
      {
        address,
        registered: true,
        emailVerified: Date.now(),
      }
    )

    await user?.save()

    return res.redirect('/')
  }
)

export default router
