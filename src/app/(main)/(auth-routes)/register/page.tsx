import { RegisterForm } from "@/components/features/auth/register/RegisterForm";
import AuthSplitLayout from "@/components/features/auth/auth-split-layout";

export default function RegisterPage() {
  return (
    <AuthSplitLayout>
      <RegisterForm />
    </AuthSplitLayout>
  );
}
