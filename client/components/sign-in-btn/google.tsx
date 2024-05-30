import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";

export function GoogleSignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <Button type="submit">Signin with Google</Button>
    </form>
  );
}
