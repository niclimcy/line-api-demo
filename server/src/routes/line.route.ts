import { Router, type Request, type Response } from 'express'
import User from '../schemas/line.user.schema'
import { authenticatedUser } from '../middleware/auth.middleware'
import { lineClient } from '../middleware/line.middleware'
import ChatHistory from '../schemas/chatHistory.schema'

const router = Router()

router.get(
  '/linechat',
  authenticatedUser,
  async (req: Request, res: Response) => {
    if (!res.locals?.session) return res.redirect('/')

    try {
      const users = await User.find({})
      return res.render('linechat', {
        users: users,
        messageSent: false,
        errorMessage: null,
      })
    } catch (error) {
      console.error(error)
      return res.render('linechat', {
        users: [],
        messageSent: false,
        errorMessage: null,
      })
    }
  }
)

router.post(
  '/send-message',
  authenticatedUser,
  async (req: Request, res: Response) => {
    if (!res.locals?.session) return res.sendStatus(400)

    const recipient = req.body.recipient
    const message = req.body.message

    try {
      // Send the message...
      const client = lineClient()

      const messageSent = await client.pushMessage({
        to: recipient,
        messages: [
          {
            type: 'text',
            text: message,
          },
        ],
      })

      if (messageSent.sentMessages.length > 0) {
        return res.render('linechat', {
          users: await User.find({}),
          messageSent: true,
        })
      } else {
        return res.render('linechat', {
          users: await User.find({}),
          messageSent: false,
          errorMessage: 'An error occurred while sending the message.',
        })
      }
    } catch (error) {
      console.error(error)
      return res.render('linechat', {
        users: await User.find({}),
        messageSent: false,
        errorMessage: 'An error occurred while sending the message.',
      })
    }
  }
)

// Get all messages
router.get('/messages', async (req, res) => {
  try {
    const chats = await ChatHistory.find({})
    res.send(chats)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
})

export default router
