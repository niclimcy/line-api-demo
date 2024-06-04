import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { SiLine, SiGoogle, SiFacebook } from "@icons-pack/react-simple-icons";
import { PasswordLogin } from "@/components/password-login";

const BACKEND_URL = process.env.BACKEND_URL ?? "";

export default function Login() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button asChild variant="outline" className="w-full">
            <Link href={BACKEND_URL + "/login/federated/line"}>
              <SiLine className="size-5 mr-2" />
              Sign-in with LINE
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href={BACKEND_URL + "/login/federated/google"}>
              <SiGoogle className="size-5 mr-2" />
              Sign-in with Google
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href={BACKEND_URL + "/login/federated/facebook"}>
              <SiFacebook className="size-5 mr-2" />
              Sign-in with Facebook
            </Link>
          </Button>
          <div className="text-muted-foreground w-full text-center">OR</div>
          <Separator />
          <PasswordLogin />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </main>
  );
}
