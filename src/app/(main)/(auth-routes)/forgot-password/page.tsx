import { ForgotPasswordForm } from "@/components/features/auth/forgot-password/ForgotPasswordForm";
import AuthSplitLayout from "@/components/features/auth/auth-split-layout";

export default function ForgotPasswordPage() {
  return (
    <AuthSplitLayout>
      <ForgotPasswordForm />
    </AuthSplitLayout>
  );
}
