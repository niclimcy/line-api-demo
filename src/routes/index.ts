import { Router, Request, Response } from 'express'
import { authenticatedUser } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', authenticatedUser, (req: Request, res: Response) => {
  {
    return res.render('home', { session: res.locals?.session })
  }
})

router.get('/auth/signup', (req: Request, res: Response) => {
  {
    return res.render('signup', { error: '' })
  }
})

export default router
