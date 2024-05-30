import { Router, type Request, type Response } from 'express'
import { lineClient } from '../middleware/line.middleware'
import ChatHistory from '../schemas/chatHistory.schema'

const router = Router()

router.post('/send-message', async (req: Request, res: Response) => {
  const recipient: string = req.body.recipient
  const message: string = req.body.message

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
      return res.status(201).send({ messageSent: true })
    } else {
      return res.status(400).send({ messageSent: false })
    }
  } catch (error) {
    console.log(error)
    return res.status(400).send({ messageSent: false })
  }
})

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
