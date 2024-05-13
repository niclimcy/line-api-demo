import { Router, type Request, type Response } from 'express'
import { authenticatedUser } from '../middleware/auth.middleware'
import User from '../schemas/user.schema'

const router = Router()

router.get('/', authenticatedUser, async (req: Request, res: Response) => {
  {
    if (res.locals.session && res.locals.session.user.email) {
      const email = res.locals.session.user.email

      try {
        // Find the user by email
        const user = await User.findOne({ email })

        // Check if the user is registered
        if (user && !user.registered) {
          // If the user is not registered, redirect to the registration page
          return res.redirect('/auth/register')
        }
      } catch (error) {
        console.log(error)
        return res.render('home', { session: res.locals?.session })
      }
    }

    return res.render('home', { session: res.locals?.session })
  }
})

router.get('/auth/signup', (req: Request, res: Response) => {
  {
    return res.render('signup', { error: '' })
  }
})

export default router
