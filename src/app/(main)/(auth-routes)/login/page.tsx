import { LoginForm } from "@/components/features/auth/login/LoginForm";
import AuthSplitLayout from "@/components/features/auth/auth-split-layout";

export default function LoginPage() {
  return (
    <AuthSplitLayout>
      <LoginForm />
    </AuthSplitLayout>
  );
}
