import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SiLine } from "@icons-pack/react-simple-icons";
import {
  FileDownIcon,
  CloudUploadIcon,
  MessageSquareTextIcon,
  LogInIcon,
  LogOutIcon,
} from "lucide-react";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "";

interface UserSession {
  _id: string;
  name: string;
}

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

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Book Store</CardTitle>
            <CardDescription>Not Logged In</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">
                <LogInIcon className="size-5 mr-2" />
                Log In
              </Link>
            </Button>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Book Store</CardTitle>
          <CardDescription>{user.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <h1 className="text-lg font-semibold">Actions</h1>
          <Button asChild variant="outline" className="w-full">
            <Link href="/line-chat">
              <SiLine className="size-5 mr-2" />
              Message LINE users
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href={BACKEND_URL + "/users/export"}>
              <FileDownIcon className="size-5 mr-2" />
              Export all user data
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/upload-files">
              <CloudUploadIcon className="size-5 mr-2" />
              Upload files
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/chat">
              <MessageSquareTextIcon className="size-5 mr-2" />
              Chat with others
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href={BACKEND_URL + "/logout"}>
              <LogOutIcon className="size-5 mr-2" />
              Logout
            </Link>
          </Button>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </main>
  );
}
