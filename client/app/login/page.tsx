import LoginUI from "@/components/login-ui";

const BACKEND_URL = process.env.BACKEND_URL ?? "";

export default function Login() {
  return <LoginUI backendUrl={BACKEND_URL} />;
}
