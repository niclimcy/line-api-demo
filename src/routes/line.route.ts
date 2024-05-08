import { Router, Request, Response } from 'express'
import crypto from 'crypto'
import User from '../schemas/user.schema.js'
import { authenticatedUser } from '../middleware/auth.middleware.js'
import { followEventHandler, messageEventHandler, sendMessage } from '../lib/lineHelpers.js'

const router = Router()

router.post('/webhook', (req: Request, res: Response) => {
  {
    const channelSecret = process.env.MSG_LINE_SECRET
    if (!channelSecret) {
      console.log('Missing MSG_LINE_SECRET in env')
      return
    }
    const body = JSON.stringify(req.body)
    const signature = crypto
      .createHmac('SHA256', channelSecret)
      .update(body)
      .digest('base64')

    // Compare x-line-signature request header and the signature
    const headerSignature = req.headers['x-line-signature']
    if (!headerSignature) {
      res.status(400).send('Missing x-line-signature header')
      return
    }

    if (signature !== headerSignature) {
      res.status(400).send('Invalid signature')
      return
    }

    // Signature is valid, handle the request
    res.status(200).send('OK')

    // Loop through all events
    const events: Array<any> = req.body.events
    events.forEach(async (event) => {
      // check for follow event
      if (event.type == 'follow' && event.source?.userId) {
        await followEventHandler(event)
      } else if (event.type == 'message' && event.source?.userId) {
        await messageEventHandler(event)
      }
    })
  }
})

router.get(
  '/message',
  authenticatedUser,
  async (req: Request, res: Response) => {
    if (!res.locals?.session) return res.redirect('/')

    try {
      const users = await User.find({})
      return res.render('message', {
        users: users,
        messageSent: false,
        errorMessage: null,
      })
    } catch (error) {
      console.error(error)
      return res.render('message', {
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
      const messageSent = await sendMessage(recipient, [
        {
          type: 'text',
          text: message,
        },
      ])

      if (messageSent) {
        return res.render('message', {
          users: await User.find({}),
          messageSent: true,
        })
      } else {
        return res.render('message', {
          users: await User.find({}),
          messageSent: false,
          errorMessage: 'An error occurred while sending the message.',
        })
      }
    } catch (error) {
      console.error(error)
      return res.render('message', {
        users: await User.find({}),
        messageSent: false,
        errorMessage: 'An error occurred while sending the message.',
      })
    }
  }
)

export default router
