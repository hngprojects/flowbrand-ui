import { ForgotPasswordForm } from "@/components/features/auth/forgotPassword/ForgotPasswordForm";
import AuthSplitLayout from "@/components/features/auth/authSplitLayout";

export default function ForgotPasswordPage() {
  return (
    <AuthSplitLayout>
      <ForgotPasswordForm />
    </AuthSplitLayout>
  );
}
