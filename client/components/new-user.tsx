import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const BACKEND_URL = process.env.BACKEND_URL ?? "";

export function NewUser() {
  return (
    <form action={BACKEND_URL + "/create-user"} method="POST">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input type="name" id="name" name="name" placeholder="John Doe" />
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="email@example.com"
        />
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" name="password" />
        <Label htmlFor="verifyPassword">Verify Password</Label>
        <Input type="password" id="verifyPassword" name="verifyPassword" />
        <Button type="submit">Sign Up</Button>
      </div>
    </form>
  );
}
