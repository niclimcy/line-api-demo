"use server";

export async function sendMessage(prevState: any, formData: FormData) {
  const rawFormData = {
    recipient: formData.get("recipient"),
    message: formData.get("message"),
  };

  const res = await fetch(`${process.env.BACKEND_URL}/send-message`, {
    method: "POST",
    body: JSON.stringify(rawFormData),
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  });

  if (!res.ok) {
    return {
      success: false,
      message: "Message not sent!",
      resetKey: Date.now().toString(),
    };
  }

  return {
    success: true,
    message: "Message sent!",
    resetKey: Date.now().toString(),
  };
}
