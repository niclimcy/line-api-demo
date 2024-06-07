import SignUpUI from "@/components/sign-up-ui";

const BACKEND_URL = process.env.BACKEND_URL ?? "";

export default function SignUp() {
  return <SignUpUI backendUrl={BACKEND_URL} />;
}
