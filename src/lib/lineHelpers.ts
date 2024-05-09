import User from '../schemas/line.user.schema.js'
import ChatHistory from '../schemas/chatHistory.schema.js'

interface LineProfile {
  userId: string
  displayName: string
}

const getUserProfile = async (
  userId: string
): Promise<LineProfile | undefined> => {
  const response = await fetch(`https://api.line.me/v2/bot/profile/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.MSG_LINE_ACCESS_TOKEN}`,
    },
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return await response.json()
}

async function addLineUser(profile: LineProfile): Promise<boolean> {
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

export async function followEventHandler(event: any): Promise<void> {
  // Get user profile details
  const profile = await getUserProfile(event.source.userId)
  if (!profile) return

  // Add line user if does not exist yet
  await addLineUser(profile)
}

export async function messageEventHandler(event: any): Promise<void> {
  // Get user profile details
  const profile = await getUserProfile(event.source.userId)
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
      await replyMessage(
        [
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
        event.replyToken
      )
    }
  }
}

async function replyMessage(
  messages: any[],
  replyToken: string
): Promise<boolean> {
  const requestData = {
    replyToken: replyToken,
    messages: messages,
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.MSG_LINE_ACCESS_TOKEN}`,
  }

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/reply', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData),
    })

    if (response.ok) {
      return true
    } else {
      const errorData = await response.json()
      console.error('Error sending message:', errorData)
      return false
    }
  } catch (error) {
    console.error('Error sending message:', error)
    return false
  }
}

export async function sendMessage(
  recipientId: string,
  messages: any[]
): Promise<boolean> {
  const requestData = {
    to: recipientId,
    messages: messages,
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.MSG_LINE_ACCESS_TOKEN}`,
  }

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData),
    })

    if (response.ok) {
      return true
    } else {
      const errorData = await response.json()
      console.error('Error sending message:', errorData)
      return false
    }
  } catch (error) {
    console.error('Error sending message:', error)
    return false
  }
}
