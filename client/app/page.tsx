import { cookies } from "next/headers";
import { UserSession } from "@/types";
import HomeUI from "@/components/home-ui";

const BACKEND_URL = process.env.BACKEND_URL ?? "";

async function getCurrentUser(): Promise<UserSession | undefined> {
  const res = await fetch(`${process.env.BACKEND_URL}/current-user`, {
    cache: "no-cache",
    headers: { Cookie: cookies().toString() },
  });

  if (!res.ok) {
    return undefined;
  }

  return res.json();
}

export default async function Home() {
  const user = await getCurrentUser();

  return <HomeUI user={user} backendUrl={BACKEND_URL} />;
}
