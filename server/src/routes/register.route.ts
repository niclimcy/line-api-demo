import { Router, type Request, type Response } from 'express'
import User from '../schemas/user.schema'

const url = process.env.FRONTEND_URL || 'http://localhost:3001'
const router = Router()

router.post('/create-user', async (req: Request, res: Response) => {
  const { name, email, password, verifyPassword } = req.body

  // Check if passwords match
  if (password !== verifyPassword) {
    // Passwords don't match, render sign-up page with an error message
    return res.status(400).send({ error: 'Passwords do not match' })
  }

  // Make sure password is not empty
  if (password.length < 8) {
    // Password empty or not long enough, render sign-up page with an error message
    return res.status(400).send({ error: 'Passwords is too short' })
  }

  // Find if an existing user with specified email already exists
  const existingUser = await User.findOne({ username: email })
  if (existingUser) {
    return res.status(400).send({ error: 'User already exists' })
  }

  try {
    await User.register({ username: email, name }, password)
  } catch (error) {
    console.error(error)
    return res.status(500)
  }

  return res.redirect(url + '/')
})

router.post('/get-otp', async (req: Request, res: Response) => {
  return res.status(200)
})

router.post('/register-user', async (req: Request, res: Response) => {
  const { name, email, address, otp } = req.body

  // Function to match otp
  if (otp != '123456') {
    return res.status(400).send({ message: 'OTP Invalid' })
  }

  // Find if an existing user and update details
  const user = await User.findOneAndUpdate(
    { email: email },
    {
      address,
      registered: true,
      emailVerified: Date.now(),
    }
  )

  await user?.save()

  return res.redirect(url + '/')
})

export default router
