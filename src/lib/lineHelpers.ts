import User from '../schemas/user.schema.js'
import ChatHistory from '../schemas/chatHistory.schema.js'

interface LineNewMessage {
  type: string
  text: string
}

interface LineProfile {
  userId: string
  displayName: string
}

const getUserProfile = async (userId: string): Promise<LineProfile | undefined> => {
  const response = await fetch(`https://api.line.me/v2/bot/profile/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.MSG_LINE_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
};

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
            type: 'text',
            text: 'hi',
          },
        ],
        event.replyToken
      )
    }
  }
}

async function replyMessage(
  messages: LineNewMessage[],
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
  messages: LineNewMessage[]
): Promise<boolean> {
  const requestData = {
    to: recipientId,
    messages: messages,
  }
  console.log(requestData)

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
