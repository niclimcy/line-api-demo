import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NewUser } from "@/components/new-user";

export default function SignUp() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <NewUser />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </main>
  );
}
