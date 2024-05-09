import { Router, Request, Response } from 'express'
import { hashPassword } from '../lib/passwordHelpers.js'
import CredentialUser from '../schemas/credential.user.schema.js'

const router = Router()

router.post('/create-user', async (req: Request, res: Response) => {
  const {name, email, password, verifyPassword} = req.body

  // Check if passwords match
  if (password !== verifyPassword) {
    // Passwords don't match, render the sign-up page with an error message
    return res.render('signup', { error: 'Passwords do not match' });
  }

  const hashPw = await hashPassword(password)

  try {
    const user = new CredentialUser({email, password: hashPw, name})
    await user.save()
  } catch (error) {
    console.error(error)
    return res.status(500)
  }

  return res.redirect('/')
})

export default router
