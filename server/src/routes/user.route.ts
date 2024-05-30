import { Router, type Request, type Response } from 'express'
import { authorizationRequired } from '../middleware/auth.middleware'
import User from '../schemas/user.schema'
import LineUser from '../schemas/line.user.schema'
import Papa from 'papaparse'

const router = Router()

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).lean()
    return users
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch users' })
  }
}

router.get(
  '/users',
  authorizationRequired,
  async (req: Request, res: Response) => {
    const users = await getUsers(req, res)
    if (users instanceof Response) {
      return users
    }

    return res.status(200).send(users)
  }
)

router.get('/users/line', async (req: Request, res: Response) => {
  try {
    const users = await LineUser.find({})
    return res.status(200).send(users)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch users' })
  }
})

router.get(
  '/users/export',
  authorizationRequired,
  async (req: Request, res: Response) => {
    try {
      const users = await getUsers(req, res)
      if (users instanceof Response) {
        return users
      }

      if (!Array.isArray(users)) {
        throw new Error('Expected an array of users')
      }

      const usersCsv = Papa.unparse(users, {
        columns: ['name', 'email', 'address', 'emailVerified'],
      })

      res.setHeader('Content-Type', 'text/csv')
      res.attachment('users.csv').send(usersCsv)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Failed to export users' })
    }
  }
)

export default router
