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
import { FileDownIcon } from "lucide-react";

const BACKEND_URL = process.env.BACKEND_URL ?? "";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Book Store</CardTitle>
          <CardDescription>Card Description</CardDescription>
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
        </CardContent>
        <CardFooter>Card Footer</CardFooter>
      </Card>
    </main>
  );
}
