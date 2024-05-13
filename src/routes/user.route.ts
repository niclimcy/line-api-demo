import { Router, Request, Response } from 'express'
import { authorizationRequired } from '../middleware/auth.middleware'
import User from '../schemas/user.schema'
import { Parser } from '@json2csv/plainjs'

const router = Router()

router.get(
  '/users',
  authorizationRequired,
  async (req: Request, res: Response) => {
    try {
      const users = await User.find({})
      return res.status(200).send(users)
    } catch (error) {
      console.log(error)
      return res.status(500)
    }
  }
)

router.get(
  '/users/export',
  authorizationRequired,
  async (req: Request, res: Response) => {
    try {
      const users = await User.find({})
      const fields = [
        {
          label: 'Name',
          value: 'name',
        },
        {
          label: 'Email',
          value: 'email',
        },
        {
          label: 'Address',
          value: 'address',
        },
        {
          label: 'Registered',
          value: 'registered',
        },
      ]
      const parser = new Parser({ fields })
      const csv = parser.parse(users)

      res.setHeader('Content-Type', 'text/csv')
      res.attachment('users.csv').send(csv)
    } catch (error) {
      console.log(error)
      return res.status(500)
    }
  }
)

export default router
