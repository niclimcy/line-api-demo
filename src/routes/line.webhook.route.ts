import { Router, type Request } from 'express'
import {
  followEventHandler,
  messageEventHandler,
} from '../lib/lineEventHandlers'
import { lineBotMiddlware } from '../middleware/line.middleware'
import type { WebhookEvent } from '@line/bot-sdk'

const router = Router()

router.post('/', lineBotMiddlware(), (req: Request) => {
  {
    // Loop through all events
    const events: Array<WebhookEvent> = req.body.events
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

export default router
