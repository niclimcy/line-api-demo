import { LineUser } from "@/lib/types";
import { LineForm } from "@/components/line-form";

async function getData(): Promise<LineUser[]> {
  const res = await fetch(`${process.env.BACKEND_URL}/users/line`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function LineChat() {
  const users = await getData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <LineForm users={users} />
    </main>
  );
}
