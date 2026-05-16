import { RegisterForm } from "@/components/features/auth/register/RegisterForm";
import AuthSplitLayout from "@/components/features/auth/authSplitLayout";

export default function RegisterPage() {
  return (
    <AuthSplitLayout>
      <RegisterForm />
    </AuthSplitLayout>
  );
}
