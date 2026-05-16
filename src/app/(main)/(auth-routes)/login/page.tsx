import { LoginForm } from "@/components/features/auth/login/LoginForm";
import AuthSplitLayout from "@/components/features/auth/authSplitLayout";

export default function LoginPage() {
  return (
    <AuthSplitLayout>
      <LoginForm />
    </AuthSplitLayout>
  );
}
