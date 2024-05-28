import { middleware, messagingApi } from '@line/bot-sdk'
const { MessagingApiClient } = messagingApi

export function lineBotMiddlware() {
  const channelSecret = process.env.MSG_LINE_SECRET ?? ''
  if (!channelSecret) {
    console.log('Missing MSG_LINE_SECRET in env')
  }

  return middleware({ channelSecret })
}

export function lineClient() {
  const channelAccessToken = process.env.MSG_LINE_ACCESS_TOKEN ?? ''

  if (!channelAccessToken) {
    console.log('Missing MSG_LINE_ACCESS_TOKEN in env')
  }

  return new MessagingApiClient({ channelAccessToken })
}
