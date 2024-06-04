import { Router, type Request, type Response } from 'express'

const router = Router()

router.get('/auth/signup', (req: Request, res: Response) => {
  {
    return res.render('signup', { error: '' })
  }
})

export default router
