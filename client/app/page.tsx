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

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Book Store</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <h1 className="text-lg font-semibold">Actions</h1>
          <Button asChild variant="outline">
            <Link href="/line-chat">Message LINE users</Link>
          </Button>
        </CardContent>
        <CardFooter>Card Footer</CardFooter>
      </Card>
    </main>
  );
}
