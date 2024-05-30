"use server";

export async function sendMessage(formData: FormData) {
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
    throw new Error("Failed to send message");
  }

  return {
    message: "Message sent!",
  };
}
