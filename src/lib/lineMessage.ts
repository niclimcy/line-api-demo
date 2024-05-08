interface LineMessage {
  type: string;
  text: string;
}

export async function sendMessage(recipientId: string, messages: LineMessage[]): Promise<boolean> {
  const requestData = {
    to: recipientId,
    messages: messages
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.MSG_LINE_ACCESS_TOKEN}`,
  };

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData)
    });

    if (response.ok) {
      return true;
    } else {
      const errorData = await response.json();
      console.error('Error sending message:', errorData);
      return false;
    }
  } catch (error) {
    console.error('Error sending message:', error);
    return false;
  }
}