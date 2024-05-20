import User from '../schemas/line.user.schema'
import ChatHistory from '../schemas/chatHistory.schema'
import type { FollowEvent, MessageEvent } from '@line/bot-sdk'
import type { UserProfileResponse } from '@line/bot-sdk/dist/messaging-api/api'
import { lineClient } from '../middleware/line.middleware'

const getUserProfile = async (
  userId: string
): Promise<UserProfileResponse | undefined> => {
  const client = lineClient()
  try {
    const profile = await client.getProfile(userId)
    return profile
  } catch (error: unknown) {
    console.log(error)
    return
  }
}

async function addLineUser(profile: UserProfileResponse): Promise<boolean> {
  const { userId, displayName } = profile

  // Add user to db
  try {
    const existingUser = await User.findOne({ userId: userId })
    // Only add new user if they do not exist
    if (!existingUser) {
      const user = new User({ userId, displayName })
      await user.save()
    }

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function followEventHandler(event: FollowEvent): Promise<void> {
  // Get user profile details
  const profile = await getUserProfile(event.source?.userId ?? '')
  if (!profile) return

  // Add line user if does not exist yet
  await addLineUser(profile)
}

export async function messageEventHandler(event: MessageEvent): Promise<void> {
  // Get user profile details
  const profile = await getUserProfile(event.source?.userId ?? '')
  if (!profile) return

  // Add line user if does not exist yet
  await addLineUser(profile)

  // Add message to db if message is of type text
  if (event.message.type == 'text') {
    // find user in db
    const user = await User.findOne({ userId: profile.userId })

    const text: string = event.message.text

    // add chat history to db
    const chatHistory = new ChatHistory({
      user: user,
      text: text,
    })

    await chatHistory.save()

    // reply message example
    if (text == 'hello') {
      const client = lineClient()

      await client.replyMessage({
        replyToken: event.replyToken,
        messages: [
          {
            type: 'flex',
            altText: 'Your Delivery Info',
            contents: {
              type: 'bubble',
              header: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: 'DK Books',
                    color: '#FFFFFF',
                    weight: 'bold',
                  },
                ],
              },
              hero: {
                type: 'image',
                url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                size: 'xl',
              },
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: 'Pending Delivery',
                    size: 'xl',
                    weight: 'bold',
                    align: 'center',
                  },
                  {
                    type: 'separator',
                    margin: 'md',
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'button',
                        action: {
                          type: 'uri',
                          label: 'View delivery info',
                          uri: 'https://example.com',
                        },
                        style: 'link',
                      },
                      {
                        type: 'button',
                        action: {
                          type: 'uri',
                          label: 'Visit our website',
                          uri: 'https://liff.line.me/xxxxx-xxxxx/',
                        },
                        style: 'link',
                      },
                    ],
                    paddingTop: '10px',
                  },
                ],
              },
              styles: {
                header: {
                  backgroundColor: '#00B900',
                },
              },
            },
          },
        ],
      })
    }
  }
}
