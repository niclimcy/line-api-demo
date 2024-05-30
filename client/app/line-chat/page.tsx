import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-btn";
import { sendMessage } from "@/app/actions";

interface LineUser {
  userId: string;
  displayName: string;
}

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
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Send LINE Message</CardTitle>
        </CardHeader>
        <form action={sendMessage}>
          <CardContent className="space-y-2">
            <Select name="recipient">
              <SelectTrigger>
                <SelectValue placeholder="-- SELECT A USER --" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => {
                  return (
                    <SelectItem value={user.userId} key={user.userId}>
                      {user.displayName}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Textarea name="message" placeholder="Type your message here." />
          </CardContent>
          <CardFooter>
            <SubmitButton>Send message</SubmitButton>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
